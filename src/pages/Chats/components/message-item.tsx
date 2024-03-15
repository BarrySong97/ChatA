import { Message } from "@/api/models/Chat";
import React, { FC } from "react";
export interface MessageItemProps {
  data: Message;
}
const MessageItem: FC<MessageItemProps> = ({ data }) => {
  const renderUser = () => {
    return (
      <div className="flex  flex-col items-end">
        <div>You</div>
        <div>{data.content}</div>
      </div>
    );
  };
  const renderAssist = () => {
    return (
      <div>
        <div>Chatbot</div>
        <div> {data.content}</div>
      </div>
    );
  };
  return <div>{data.role === "user" ? renderUser() : renderAssist()}</div>;
};

export default MessageItem;
