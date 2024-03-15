import { Chat } from "@/api/models/Chat";
import { Divider } from "antd";
import { FC } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import { ScrollShadow } from "@nextui-org/react";
export interface ChatboxProps {
  selectChat?: Chat;
}
const Chatbox: FC<ChatboxProps> = ({ selectChat }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full">
        <div className="p-4 pb-0 text-large font-semibold">
          {selectChat?.title}
        </div>
        <Divider className="mt-2 w-full mb-0" />
      </div>
      <ScrollShadow className="flex-1 scrollbar px-4 pt-2">
        <MessageList />
      </ScrollShadow>
      <div className="h-[180px]">
        <Divider className="p-0 m-0 w-full" />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chatbox;
