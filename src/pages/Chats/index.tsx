import { FC, useCallback, useState } from "react";
import "./index.css";
import ChatList from "./components/chat-list";
import { Divider } from "@nextui-org/react";
import { useQuery } from "react-query";
import { ChatService } from "@/api/services/ChatService";
import { Chat } from "@/api/models/Chat";
import Chatbox from "./components/chat-box";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
export interface ChatsProps {}
const Chats: FC<ChatsProps> = () => {
  const [selectChat, setSelectChat] = useState<Chat>();
  const [brand] = useAtom(brandAtom);
  const { data: chats } = useQuery<Chat[]>(
    ["chats", brand?.id],
    () => ChatService.listChat(brand?.id),
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setSelectChat(data?.[0]);
      },
    }
  );
  const onSelectChatChange = useCallback((c?: Chat) => {
    setSelectChat(c);
  }, []);
  return (
    <div className=" flex h-full w-full ">
      <div className="basis-[220px] flex-shrink-0  no-drag ">
        <ChatList
          selectChat={selectChat}
          onChange={onSelectChatChange}
          data={chats}
        />
      </div>
      <Divider orientation="vertical" className="h-full w-[1px]" />
      <div className="flex-1">
        <Chatbox onSelectChat={onSelectChatChange} selectChat={selectChat} />
      </div>
    </div>
  );
};

export default Chats;
