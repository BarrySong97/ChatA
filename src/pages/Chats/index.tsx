import React, { FC, useState } from "react";
import ChatList from "./components/chat-list";
import { Divider } from "@nextui-org/react";
import { useQuery } from "react-query";
import { ChatService } from "@/api/services/ChatService";
import { Chat } from "@/api/models/Chat";
import Chatbox from "./components/chat-box";
export interface ChatsProps {}
const Chats: FC<ChatsProps> = () => {
  const [selectChat, setSelectChat] = useState<Chat>();
  const { data: chats } = useQuery<Chat[]>(
    "chats",
    () => ChatService.listChat(),
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setSelectChat(data?.[0]);
      },
    }
  );
  return (
    <div className=" flex h-full w-full ">
      <div className="basis-[220px] flex-shrink-0  no-drag ">
        <ChatList
          selectChat={selectChat}
          onChange={(c) => setSelectChat(c)}
          data={chats}
        />
      </div>
      <Divider orientation="vertical" className="h-full w-[1px]" />
      <div className="flex-1">
        <Chatbox
          onSelectChat={(c) => setSelectChat(c)}
          selectChat={selectChat}
        />
      </div>
    </div>
  );
};

export default Chats;
