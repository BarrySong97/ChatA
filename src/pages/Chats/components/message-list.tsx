import { FC } from "react";
import MessageItem from "./message-item";
import { Message } from "@/api/models/Chat";
import { ScrollShadow } from "@nextui-org/react";
export interface MessageListProps {}
const MessageList: FC<MessageListProps> = () => {
  const data = new Array(0).fill(0).map((v, i) => {
    return {
      id: Math.random() + "",
      role: i % 2 === 0 ? "user" : "assitant",
      content: "Hello world!",
    };
  });
  return (
    <>
      {data.map((v) => {
        return <MessageItem data={v as Message} />;
      })}
    </>
  );
};

export default MessageList;
