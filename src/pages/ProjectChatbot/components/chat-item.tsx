import React, { FC } from "react";
import { Message } from "./chat-list";
export interface ChatItemProps {
  data: Message;
}
const ChatItem: FC<ChatItemProps> = ({ data }) => {
  const renderUserMessage = () => {
    return (
      <div className="text-right">
        <div className="font-semibold mb-1">You</div>
        <div className="text-small">{data.content}</div>
      </div>
    );
  };
  const renderAssistantMessage = () => {
    return (
      <div>
        <div className="font-semibold mb-1">Chatbot</div>
        <div className="text-small">{data.content}</div>
      </div>
    );
  };
  return (
    <div className="mb-4">
      {data.role === "user" ? renderUserMessage() : renderAssistantMessage()}
    </div>
  );
};

export default ChatItem;
