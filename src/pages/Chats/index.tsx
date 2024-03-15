import React, { FC } from "react";
import ChatList from "./components/chat-list";
import { Divider } from "@nextui-org/react";
import { useQuery } from "react-query";
import { ChatService } from "@/api/services/ChatService";
import { Chat } from "@/api/models/Chat";
export interface ChatsProps {}
const Chats: FC<ChatsProps> = () => {
  const { data: chats } = useQuery<Chat[]>("chats", () => ChatService.chat(), {
    refetchOnWindowFocus: false,
  });
  return (
    <div className=" flex h-full">
      <div className="py-2 w-[200px]">
        <ChatList data={chats} />
      </div>
      <Divider orientation="vertical" className="h-full w-[1px]" />
      <div className="flex-1"></div>
    </div>
  );
};

export default Chats;
