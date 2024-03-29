import { Chat, Message } from "@/api/models/Chat";
import { brandAtom } from "@/atom";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Steps, message } from "antd";
import { useAtom } from "jotai";
import { FC, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import MessageList from "./message-list";
import { toPng, toBlob } from "html-to-image";
export interface ExportMessagesProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectChat?: Chat;
}
const ExportMessages: FC<ExportMessagesProps> = ({
  selectChat,
  isOpen,
  onOpenChange,
}) => {
  const [current, setCurrent] = useState(0);
  const [brand] = useAtom(brandAtom);
  const [checkdMessages, setCheckdMessages] = useState<Message[]>([]);
  const [imageCopyLoading, setImageCopyLoading] = useState(false);
  const [imageDownloadLoading, setImageDownloadLoading] = useState(false);
  const onChange = (value: number) => {
    setCurrent(value);
  };
  const queryClient = useQueryClient();
  const messages = queryClient.getQueryData<Message[]>([
    "messages",
    selectChat?.id,
  ]);
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 滚动到最底部
    if (isOpen) {
      messageScrollRef.current?.scrollTo({
        top: messageScrollRef.current?.scrollHeight,
      });
    }
  }, [messages, isOpen, current]);
  const onCheckedAll = () => {
    setCheckdMessages(messages ?? []);
  };
  const onUnCheckedAll = () => {
    setCheckdMessages([]);
  };
  useEffect(() => {
    if (!isOpen) {
      setCheckdMessages([]);
      setCurrent(0);
    }
  }, [isOpen]);
  const onDownload = async () => {
    if (messageContainerRef.current) {
      try {
        setImageCopyLoading(true);
        const blob = await toBlob(messageContainerRef.current, {
          backgroundColor: "white",
        });
        if (!blob) return;
        // 下载图片
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `messages.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        });
        message.success("下载成功");
      } catch (error) {
        message.error("下载失败");
      } finally {
        setImageCopyLoading(false);
      }
    }
  };
  const onCopy = async () => {
    if (messageContainerRef.current) {
      try {
        setImageDownloadLoading(true);
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
        message.success("复制成功");
      } catch (error) {
        message.error("复制失败");
      } finally {
        setImageDownloadLoading(false);
      }
    }
  };
  const renderCheck = () => {
    return (
      <>
        <div className="flex gap-2 justify-between items-center">
          <div className="text-default-500">
            已选中 {checkdMessages?.length} 条
          </div>
          <div className="flex gap-2">
            {messages?.length === checkdMessages.filter((v) => !!v)?.length ? (
              <Button
                onClick={onUnCheckedAll}
                variant="flat"
                radius="sm"
                size="sm"
              >
                取消全选
              </Button>
            ) : null}
            {messages?.length !== checkdMessages.filter((v) => !!v).length ? (
              <Button
                onClick={onCheckedAll}
                variant="flat"
                radius="sm"
                size="sm"
              >
                全选
              </Button>
            ) : null}
          </div>
        </div>
        <div
          ref={messageScrollRef}
          className="mt-2 h-[500px] overflow-auto scrollbar px-2"
        >
          {messages?.map((message, messageIndex) => {
            return (
              <div className="mb-2 flex items-start">
                <Checkbox
                  onValueChange={(v) => {
                    if (v) {
                      checkdMessages[messageIndex] = message;

                      setCheckdMessages([...checkdMessages]);
                    } else {
                      setCheckdMessages(
                        checkdMessages?.filter((m) => m?.id !== message.id)
                      );
                    }
                  }}
                  isSelected={checkdMessages?.includes(message)}
                  className="pt-3"
                />
                <div>
                  <div className="font-semibold">
                    {message.role === "assistant" ? brand?.name : "自己"}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const renderPreview = () => {
    return (
      <div className="">
        <div className="flex gap-2 mb-4 justify-end">
          <Button
            isLoading={imageCopyLoading}
            onClick={onDownload}
            variant="flat"
            size="sm"
            radius="sm"
          >
            下载图片
          </Button>
          <Button
            isLoading={imageCopyLoading}
            onClick={onCopy}
            variant="flat"
            size="sm"
            radius="sm"
          >
            复制图片
          </Button>
        </div>
        <div className="overflow-auto h-[500px] scrollbar ">
          <div ref={messageContainerRef} className="py-2 px-2">
            <MessageList
              showActions={false}
              chat={selectChat}
              data={checkdMessages.filter((v) => !!v)}
            />
          </div>
        </div>
      </div>
    );
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
              <Steps
                current={current}
                onChange={(c) => {
                  if (c === 1 && !checkdMessages?.length) {
                    message.warning("请选择消息");
                    return;
                  }
                  onChange(c);
                }}
                items={[
                  {
                    title: "选择消息",
                  },
                  {
                    title: "预览",
                  },
                ]}
              />
              {current == 0 ? renderCheck() : renderPreview()}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExportMessages;
