import { FC, useState } from "react";
import MessageItem from "./message-item";
import { Chat, Message } from "@/api/models/Chat";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
import KeyInput from "./key-input";
export interface MessageListProps {
  chat?: Chat;
  data?: Message[];
  onStop?: () => void;
  onRetry?: () => void;
  showActions?: boolean;
}
const MessageList: FC<MessageListProps> = ({
  showActions = true,
  onRetry,
  onStop,
  data,
}) => {
  const [brand] = useAtom(brandAtom);

  const [key, setKey] = useState<string>();
  return brand?.key ? (
    data?.map((v, index) => {
      const isLast = index === data.length - 1;
      return (
        <MessageItem
          onRetry={onRetry}
          isLast={isLast}
          showActions={showActions}
          onStop={onStop}
          key={v.id}
          data={v as Message}
        />
      );
    })
  ) : (
    <KeyInput value={key} setKey={setKey} type="page" />
  );
};

export default MessageList;
