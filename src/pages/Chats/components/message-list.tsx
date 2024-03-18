import { FC } from "react";
import MessageItem from "./message-item";
import { Chat, Message } from "@/api/models/Chat";
export interface MessageListProps {
  chat?: Chat;
  data?: Message[];
}
const MessageList: FC<MessageListProps> = ({ data }) => {
  return (
    <>
      {data?.map((v) => {
        return <MessageItem key={v.id} data={v as Message} />;
      })}
    </>
  );
};

export default MessageList;
