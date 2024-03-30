import { Chat, Message } from "@/api/models/Chat";
import { brandAtom } from "@/atom";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { message } from "antd";
import { FC, useRef } from "react";

import { toBlob } from "html-to-image";
import MessageItem from "./message-item";
export interface ExportMessagesProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  message: Message;
  selectChat?: Chat;
}
const ShareMessage: FC<ExportMessagesProps> = ({
  message,
  isOpen,
  onOpenChange,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const onCopy = async () => {
    if (messageContainerRef.current) {
      try {
        const blob = await toBlob(messageContainerRef.current, {
          backgroundColor: "white",
          style: {
            width: "800px",
          },
        });
        // dataurl 转成图片
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        message.success("已复制到剪切板");
      } catch (error) {
        message.error("复制失败");
      } finally {
      }
    }
  };

  return (
    <Modal
      scrollBehavior="inside"
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">分享</ModalHeader>
            <ModalBody>
              <div className="scrollbar overflow-auto">
                <MessageItem isLast={true} showActions={false} data={message} />
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShareMessage;
