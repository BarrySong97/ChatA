import { Chat, Message } from "@/api/models/Chat";
import { Divider } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import cuid from "@bugsnag/cuid";
import { ChatService } from "@/api/services/ChatService";
import { useQuery, useQueryClient } from "react-query";
import { estimateTokenLength } from "@/util";
import { brandAtom, currentModelAtom } from "@/atom";
import { useAtom } from "jotai";
import ChatHeader from "./chat-header";
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
  // 实现流式打字机效果，可以控制速度
  const typeTextRef = useRef<string>("");
  const typeIndexRef = useRef<number>(0);
  const totaTextRef = useRef<string>("");
  const typeDoneRef = useRef<boolean>(false);
  const stopTypeDoneRef = useRef<boolean>(false);

  const [currentModel] = useAtom(currentModelAtom);
  const [brand] = useAtom(brandAtom);
  // 消息回复id
  const sendIdRef = useRef<string>();
  //用户发送id
  const messageIdRef = useRef<string>();
  const onSend = async (
    message: string,
    retry?: boolean,
    deleteId?: string
  ) => {
    // 计算token
    // 为了防止messsage重新创建
    sendIdRef.current = cuid();
    messageIdRef.current = cuid();

    const messageToken =
      messages?.reduce(
        (pre, cur) => pre + estimateTokenLength(cur.content),
        0
      ) ?? 0;
    let sendMessages: Partial<Message>[] = [];
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
          deleteId: deleteId,
          retry,
          model: currentModel!.name,
          messageId: messageIdRef.current!,
          sendId: sendIdRef.current!,
          key: brand?.key ?? "",
          brandKey: brand?.id ?? "",
          // brandKey: brand?.key ?? "",
        });

        // 更新ui
        const { error } = (res as any) || {};

        if (error) {
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
        const { error } = (res as any) || {};

        if (error) {
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
  let typingInterval: any = null; // 用于存储定时器ID，以便取消定时器
  const typeMessage = () => {
    const typeSpeed = 20; // 设置每个字符的打字速度（毫秒）
    // 清除之前的定时器

    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
      if (stopTypeDoneRef.current) {
        clearInterval(typingInterval);
        return;
      }
      if (typeIndexRef.current < totaTextRef.current.length) {
        typeTextRef.current += totaTextRef.current[typeIndexRef.current++];
        queryClient.setQueryData<Message[]>(
          ["messages", newChatId],
          (_data: Message[] = []) => {
            const length = _data.length;
            if (length % 2 === 0) {
              _data.pop();
            }

            return [
              ..._data.filter((v) =>
                ["sending", "typing"].includes(v.status as any)
              ),
              {
                content: typeTextRef.current,
                role: "assistant",
                id: sendIdRef.current,
                status: "typing",
              },
            ] as Message[];
          }
        );
      } else {
        clearInterval(typingInterval);
        if (typeDoneRef.current) {
          queryClient.setQueryData<Message[]>(
            ["messages", newChatId],
            (_data: Message[] = []) => {
              const length = _data.length;
              const last = _data[length - 1];
              last.status = "success";
              return [..._data] as Message[];
            }
          );
          ChatService.insertMessage({
            id: sendIdRef.current,
            content: totaTextRef.current,
            role: "assistant",
            chatId: newChatId,
          });
          stopTypeDoneRef.current = false;
          typeIndexRef.current = 0;
          typeTextRef.current = "";
          totaTextRef.current = "";
        }
      }
    }, typeSpeed);
  };
  const gettingText = async (
    _: any,
    res: {
      text: string;
      done: boolean;
      chatId: string;
      messageId: string;
      totalTokens: number;
    }
  ) => {
    // 更新ui
    const { done, text, chatId, messageId } = res;
    if (newChatId !== chatId || messageId !== messageIdRef.current) {
      return;
    }
    totaTextRef.current = text;

    typeMessage();
    // 插入数据,插入大模型返回的数据到数据库作为消息item
    typeDoneRef.current = done;
    if (done) {
      chatRefId.current = cuid();
    }
  };
  useEffect(() => {
    // 监听流数据
    window.ipcRenderer.on(`completions`, gettingText);
    return () => {
      window.ipcRenderer.removeAllListeners(`completions`);
    };
  }, [newChatId]);

  const onStop = async () => {
    clearInterval(typingInterval);
    ChatService.stop();
    // 重置
    typeDoneRef.current = true;
    stopTypeDoneRef.current = true;
    sendIdRef.current = cuid();
    messageIdRef.current = cuid();
    typeIndexRef.current = 0;
    typeTextRef.current = "";
    totaTextRef.current = "";

    queryClient.setQueryData<Message[]>(
      ["messages", newChatId],
      (_data: Message[] = []) => {
        const length = _data.length;
        const last = _data[length - 1];
        last.status = "success";
        return [..._data] as Message[];
      }
    );
    typeDoneRef.current = false;
    stopTypeDoneRef.current = false;
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
  const lasMessage = messages?.[messages.length - 1];
  return (
    <div className="flex flex-col h-full">
      <div className="w-full">
        <ChatHeader
          length={messages?.length ?? 0}
          onSelectChat={onSelectChat}
          currentChat={selectChat}
        />
        <Divider className="mt-2 w-full mb-0" />
      </div>
      <div className=" flex-1  pl-4 pt-3 pb-4">
        <MessageList onStop={onStop} onRetry={onRetry} data={messages} />
      </div>
      <div className="pb-4">
        <ChatInput
          lasMessage={lasMessage}
          onSend={onSend}
          currentChat={selectChat}
        />
      </div>
    </div>
  );
};

export default Chatbox;
