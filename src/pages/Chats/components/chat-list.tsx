import { Chat } from "@/api/models/Chat";
import { ScrollShadow } from "@nextui-org/react";
import { FC, useState } from "react";
import { clsx } from "clsx";

export interface ChatListProps {
  data?: Chat[];
}
const ChatList: FC<ChatListProps> = ({ data }) => {
  const [selectRow, setSelectRow] = useState<Chat>();
  return (
    <ScrollShadow className="h-full px-2 overflow-auto scrollbar">
      {data?.map((chat) => {
        const chatlistClassName = clsx(
          "rounded-md text-sm cursor-pointer p-1 hover:transition-colors hover:bg-primary/20 hover:text-primary",
          {
            "bg-primary/20 text-primary": chat.id === selectRow?.id,
          }
        );
        return (
          <div
            key={chat.id}
            onClick={() => {
              setSelectRow(chat);
            }}
            className={chatlistClassName}
          >
            {chat.title}
          </div>
        );
      })}
    </ScrollShadow>
  );
};

export default ChatList;
