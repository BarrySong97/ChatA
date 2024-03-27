import { Chat, Message } from "@/api/models/Chat";
import { Divider } from "antd";
import { FC, useEffect, useRef } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import cuid from "@bugsnag/cuid";
import { ChatService } from "@/api/services/ChatService";
import { useQuery, useQueryClient } from "react-query";
import { estimateTokenLength } from "@/util";
import { brandAtom, currentModelAtom } from "@/atom";
import { useAtom } from "jotai";
export interface ChatboxProps {
  selectChat?: Chat;
  onSelectChat: (chat: Chat) => void;
}
const renderError = (error: any) => {
  const errorString = `
\`\`\`json
${JSON.stringify(error, null, 2)}

\`\`\`
`;
  return errorString;
};
const Chatbox: FC<ChatboxProps> = ({ selectChat, onSelectChat }) => {
  const queryClient = useQueryClient();
  const chatRefId = useRef<string>(cuid());
  if (!selectChat) {
    selectChat = {
      id: chatRefId.current,
      type: "new",
    } as Chat;
  }
  const newChatId = selectChat?.id!;
  const { data: messages } = useQuery<Message[]>(["messages", newChatId], {
    queryFn: () =>
      selectChat?.type === "new"
        ? []
        : ChatService.getMessageByChatId(selectChat?.id!),
    retry: false,
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const refMessage = useRef<string>("");
  const refId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentModel] = useAtom(currentModelAtom);
  const [brand] = useAtom(brandAtom);
  // 消息回复id
  const sendIdRef = useRef<string>();
  //用户发送id
  const messageIdRef = useRef<string>();
  const onSend = async (message: string, retry?: boolean, lastId?: string) => {
    // 计算token
    // 为了防止messsage重新创建
    sendIdRef.current = cuid();
    messageIdRef.current = cuid();

    const messageToken =
      messages?.reduce(
        (pre, cur) => pre + estimateTokenLength(cur.content),
        0
      ) ?? 0;
    let sendMessages: Partial<Message>[] = [{}];
    refMessage.current = message;
    // 超过特定token就裁剪
    if (messageToken >= 8192) {
      const n = messages?.length ?? 0;
      // 每次超过的的时候就裁剪最前面的4个
      sendMessages = messages?.slice(Math.max(0, n - 4)) ?? [];
    } else {
      messages?.push({
        content: message,
        role: "user",
        id: messageIdRef.current!,
      } as Message);
      sendMessages = messages ?? [
        { content: message, role: "user" } as Message,
      ];
    }
    if (selectChat && selectChat.type !== "new") {
      // 在一个已有的chat里面创建

      queryClient.setQueryData(["messages", newChatId], () => {
        return [
          ...(messages ?? []),
          {
            content: "",
            role: "assistant",
            id: sendIdRef.current,
            status: "sending",
          },
        ];
      });
      // 发送接口，返回用户发送存在数据库里面的消息
      try {
        const res = await ChatService.sendMessage({
          messages: sendMessages,
          text: message,
          chatId: newChatId,
          lastId,
          retry,
          model: currentModel!.name,
          messageId: messageIdRef.current!,
          sendId: sendIdRef.current!,
          key: brand?.key ?? "",
          brandKey: brand?.id ?? "",
          // brandKey: brand?.key ?? "",
        });
        refId.current = res.id;
        // 更新ui
        const { error } = res as any;

        if (!error) {
          refId.current = res.id;
        } else {
          queryClient.setQueryData(["messages", newChatId], () => {
            return [
              ...(messages ?? []),
              {
                content: renderError(error),
                role: "assistant",
                id: sendIdRef.current,
                status: "success",
              },
            ];
          });
          chatRefId.current = cuid();
        }
      } catch (error) {
        chatRefId.current = cuid();
      }
    } else {
      const title = message.trim().slice(0, 12);

      queryClient.setQueryData(
        ["messages", newChatId],
        [
          { content: message, role: "user", id: messageIdRef.current },
          {
            content: "",
            role: "assistant",
            id: sendIdRef.current,
            status: "sending",
          },
        ]
      );
      // 创建一个新的chat
      const chat = await ChatService.createChat(title, brand?.id!, newChatId);
      // 更新ui
      queryClient.setQueryData(["chats", brand?.id], (data: Chat[] = []) => {
        return [chat, ...data] as Chat[];
      });

      // 更新当前chat
      onSelectChat(chat);

      // 在发送一个message
      try {
        const res = await ChatService.sendMessage({
          messages: sendMessages,
          text: message,
          messageId: messageIdRef.current!,
          sendId: sendIdRef.current!,
          chatId: newChatId,
          model: currentModel!.name,
          key: brand?.key ?? "",
          brandKey: brand?.id ?? "",
        });
        const { error } = res as any;

        if (!error) {
          refId.current = res.id;
        } else {
          queryClient.setQueryData(["messages", newChatId], () => {
            return [
              ...(messages ?? []),
              {
                content: renderError(error),
                role: "assistant",
                id: sendIdRef.current,
                status: "error",
              },
            ];
          });
          chatRefId.current = cuid();
        }
      } catch (error) {
        chatRefId.current = cuid();
      }
    }
    // 滚动到底部
  };
  useEffect(() => {
    // 监听流数据
    window.ipcRenderer.on(
      `completions`,
      async (
        _,
        res: {
          text: string;
          done: boolean;
          chatId: string;
          totalTokens: number;
        }
      ) => {
        // 更新ui
        const { done, text, chatId } = res;
        if (newChatId !== chatId) {
          return;
        }

        queryClient.setQueryData<Message[]>(
          ["messages", newChatId],
          (_data: Message[] = []) => {
            const length = _data.length;
            if (length % 2 === 0) {
              _data.pop();
            }

            return [
              ..._data,
              {
                content: text,
                role: "assistant",
                id: sendIdRef.current,
                status: "typing",
              },
            ] as Message[];
          }
        );
        // 插入数据,插入大模型返回的数据到数据库作为消息item
        if (done) {
          const { text } = res;
          chatRefId.current = cuid();
          queryClient.setQueryData<Message[]>(
            ["messages", newChatId],
            (_data: Message[] = []) => {
              const length = _data.length;
              const last = _data[length - 1];
              last.status = "success";
              return [..._data] as Message[];
            }
          );
        }
      }
    );
    return () => {
      window.ipcRenderer.removeAllListeners(`completions`);
    };
  }, [newChatId]);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
    });
  }, [messages]);

  const onStop = async () => {
    window.ipcRenderer.removeAllListeners(`completions`);
    queryClient.setQueryData<Message[]>(
      ["messages", newChatId],
      (_data: Message[] = []) => {
        const length = _data.length;
        const last = _data[length - 1];
        last.status = "success";
        return [..._data] as Message[];
      }
    );
  };
  const onRetry = async () => {
    const messages = queryClient.getQueryData<Message[]>([
      "messages",
      newChatId,
    ]);
    const deleteItem = messages?.pop(); // 删除的消息
    const last = messages?.pop(); // 从新发送的消息
    let deleteId = deleteItem?.id;
    if (deleteItem?.status === "error") {
      deleteId = "error";
    }
    if (last && deleteId) {
      onSend(last.content, true, deleteId);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="w-full">
        <div className="p-4 pb-0 text-large font-semibold">
          {selectChat?.title ?? "新的会话"}
        </div>
        <Divider className="mt-2 w-full mb-0" />
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto  scrollbar px-4 pt-3 pb-4"
      >
        <MessageList onStop={onStop} onRetry={onRetry} data={messages} />
      </div>
      <div className="pb-4">
        <ChatInput onSend={onSend} currentChat={selectChat} />
      </div>
    </div>
  );
};

export default Chatbox;
