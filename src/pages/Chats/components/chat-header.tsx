import { Chat } from "@/api/models/Chat";
import { ChatService } from "@/api/services/ChatService";
import { MdiShare } from "@/assets/icon";
import { brandAtom } from "@/atom";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { message } from "antd";
import { useAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import ExportMessages from "./export-messages";
export interface ChatHeaderProps {
  currentChat?: Chat;
  onSelectChat: (chat: Chat) => void;
  length: number;
}
const ChatHeader: FC<ChatHeaderProps> = ({
  length,
  onSelectChat,
  currentChat,
}) => {
  const [title, setTitle] = useState<string>();
  const [edit, setEdit] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const queryClient = useQueryClient();
  const [brand] = useAtom(brandAtom);
  const onUpdateTitle = async () => {
    if (!title) {
      message.warning("标题不能为空");
      return;
    }
    if (currentChat && title) {
      try {
        onSelectChat({
          ...currentChat,
          title,
        });
        queryClient.setQueryData<Chat[]>(
          ["chats", brand?.id],
          (data: Chat[] = []) => {
            const item = data.find((item) => item.id === currentChat?.id);
            if (item) {
              item.title = title;
            }
            return [...data];
          }
        );
        await ChatService.editChat({ id: currentChat.id, title });
      } catch (error) {
        message.error("修改失败");
        onSelectChat({
          ...currentChat,
        });
        queryClient.setQueryData<Chat[]>("chats", (data: Chat[] = []) => {
          const item = data.find((item) => item.id === currentChat?.id);
          if (item) {
            item.title = currentChat.title;
          }
          return [...data];
        });
        setTitle(currentChat.title);
      }
    }
  };
  useEffect(() => {
    if (currentChat) {
      setTitle(currentChat.title);
    }
  }, [currentChat]);
  return (
    <div className="flex justify-between">
      <div className="p-4 pt-2 pb-0 pl-2 flex flex-col  ">
        {edit ? (
          <Input
            onBlur={() => {
              setEdit(false);
              setTitle(currentChat?.title ?? "新的会话");
            }}
            onKeyUp={(e) => {
              // 回车键
              if (e.key === "Enter") {
                setEdit(false);
                onUpdateTitle();
              }
            }}
            size="sm"
            labelPlacement="outside"
            autoFocus
            radius="sm"
            className="w-auto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <Button
            radius="sm"
            onClick={() => {
              setEdit(true);
            }}
            size="sm"
            className="self-start"
            variant="light"
          >
            <span className="text-large font-semibold">
              {currentChat?.title ?? "新的会话"}
            </span>
          </Button>
        )}
        <div className="pl-4 text-small text-default-500 font-semibold">
          {length} 条消息
        </div>
      </div>
      <div className="self-end pr-4">
        <Tooltip content="分享" radius="sm">
          <Button
            onClick={() => setshowModal(true)}
            radius="sm"
            size="sm"
            variant="light"
            isIconOnly
          >
            <MdiShare className="text-large" />
          </Button>
        </Tooltip>
      </div>
      <ExportMessages
        isOpen={showModal}
        onOpenChange={(v) => setshowModal(v)}
      />
    </div>
  );
};

export default ChatHeader;
