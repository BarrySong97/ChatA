import { Chat, Message } from "@/api/models/Chat";
import { Divider } from "antd";
import { FC, useEffect, useRef } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import { ScrollShadow } from "@nextui-org/react";
import { ChatService } from "@/api/services/ChatService";
import { useQuery, useQueryClient } from "react-query";
import { estimateTokenLength } from "@/util";
import { brandAtom, currentModelAtom } from "@/atom";
import { useAtom } from "jotai";
export interface ChatboxProps {
  selectChat?: Chat;
  onSelectChat: (chat: Chat) => void;
}
const Chatbox: FC<ChatboxProps> = ({ selectChat, onSelectChat }) => {
  const queryClient = useQueryClient();

  const { data: messages } = useQuery<Message[]>(["message", selectChat?.id], {
    queryFn: () => ChatService.getMessageByChatId(selectChat?.id!),
    enabled: !!selectChat?.id,
  });
  const refMessage = useRef<string>("");
  const refId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentModel] = useAtom(currentModelAtom);
  const [brand] = useAtom(brandAtom);
  const onSend = async (message: string) => {
    // 计算token
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
      messages?.push({ content: message, role: "user" } as Message);
      sendMessages = messages ?? [
        { content: message, role: "user" } as Message,
      ];
    }
    if (selectChat) {
      // 在一个已有的chat里面创建
      // 发送接口，返回用户发送存在数据库里面的消息
      const res = await ChatService.sendMessage({
        messages: sendMessages,
        text: message,
        chatId: selectChat.id,
        model: currentModel!.name,
        key: brand?.key ?? "",
        brandKey: brand?.id ?? "",
        // brandKey: brand?.key ?? "",
      });
      refId.current = res.id;
      // 更新ui

      queryClient.setQueryData(
        ["messages", selectChat.id],
        (_data: Message[] = []) => {
          return [
            ...(messages ?? []),
            { content: message, role: "user", id: "" + +new Date() } as Message,
          ];
        }
      );
      queryClient.invalidateQueries(["message", selectChat.id]);
    } else {
      const title = message.trim().slice(0, 12);

      // 创建一个新的chat
      const chat = await ChatService.createChat(title, brand?.id!);

      // 更新ui
      queryClient.setQueryData(["chats", brand?.id], (data: Chat[] = []) => {
        return [chat, ...data] as Chat[];
      });
      // 更新当前chat
      onSelectChat(chat);

      // 在发送一个message
      const res = await ChatService.sendMessage({
        messages: sendMessages,
        text: message,
        chatId: chat.id,
        model: currentModel!.name,
        key: brand?.key ?? "",
        brandKey: brand?.id ?? "",
      });
      refId.current = res.id;
      // 更新ui
      queryClient.setQueryData(["messages", chat.id], (data: any[] = []) => {
        return [
          { content: message, role: "user", id: res.id, status: "sending" },
        ];
      });
    }
    // 滚动到底部
  };
  useEffect(() => {
    // 监听流数据
    window.ipcRenderer.on(
      "completions",
      async (
        _,
        res: {
          text: string;
          done: boolean;
          totalTokens: number;
        }
      ) => {
        // 更新ui
        const { done, text } = res;
        queryClient.setQueryData<Message[]>(
          ["message", selectChat?.id],
          (_data: Message[] = []) => {
            const length = _data.length;
            if (length % 2 === 0) {
              _data.pop();
            }
            return [
              ..._data,
              { content: text, role: "assistant", id: new Date().getTime() },
            ] as Message[];
          }
        );

        // 插入数据,插入大模型返回的数据到数据库作为消息item
        if (done) {
          const { text } = res;
          const message = await ChatService.insertMessage({
            chatId: selectChat?.id!,
            role: "assistant",
            content: text,
            totalTokens: 0,
          });
          queryClient.setQueryData<Message[]>(
            ["message", selectChat?.id],
            (_data: Message[] = []) => {
              const length = _data.length;
              const m = _data[length - 1];
              if (m) {
                m.id = message.id;
              }
              const res = [..._data] as Message[];
              return res;
            }
          );
        }
      }
    );
    return () => {
      window.ipcRenderer.removeAllListeners("completions");
    };
  }, [selectChat]);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
    });
  }, [messages]);
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
        <MessageList data={messages} />
      </div>
      <div className="h-[180px]">
        <Divider className="p-0 m-0 w-full" />
        <ChatInput onSend={onSend} currentChat={selectChat} />
      </div>
    </div>
  );
};

export default Chatbox;
