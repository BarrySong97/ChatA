import { Chat, Message } from "@/api/models/Chat";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { message as AntMessage } from "antd";
import { ChatService } from "@/api/services/ChatService";
import { useQueryClient } from "react-query";
import React from "react";
export interface EditMessageProps {
  currentChat?: Chat;
  message: Message;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
const EditMessage: FC<EditMessageProps> = ({
  isOpen,
  onOpenChange,
  message,
}) => {
  const [text, setText] = useState<string>();
  useEffect(() => {
    setText(message.content);
  }, [message]);
  const queryClient = useQueryClient();
  const onMessageEdit = async () => {
    try {
      if (text) {
        queryClient.setQueryData(
          ["messages", message.chatId],
          (data: Message[] = []) => {
            const item = data.find((item) => item.id === message.id);
            if (item) {
              item.content = text;
            }
            return [...data];
          }
        );
        await ChatService.editMessage({
          id: message.id,
          content: text,
        });
      } else {
        AntMessage.warning("内容不能为空");
      }
    } catch (error) {
      AntMessage.error("编辑失败");
      queryClient.setQueryData(
        ["messages", message.chatId],
        (data: Message[] = []) => {
          const item = data.find((item) => item.id === message.id);
          if (item) {
            item.content = message.content;
          }
          return [...data];
        }
      );
    }
  };
  return (
    <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">编辑消息</ModalHeader>
            <ModalBody>
              <Textarea
                classNames={{
                  input: "scrollbar",
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></Textarea>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                关闭
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await onMessageEdit();
                  onClose();
                }}
              >
                编辑
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default React.memo(EditMessage);
