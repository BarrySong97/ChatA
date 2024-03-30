import { Message } from "@/api/models/Chat";
import { IcBaselinePhotoLibrary, SolarPaperclip2Bold } from "@/assets/icon";
import { brandAtom, currentModelAtom } from "@/atom";
import { Button, Textarea } from "@nextui-org/react";
import { Chat } from "@prisma/client";
import { useAtom } from "jotai";
import { FC, useState } from "react";
export interface ChatInputProps {
  onSend: (text: string) => void;
  currentChat?: Chat;
  lasMessage?: Message;
}
const ChatInput: FC<ChatInputProps> = ({ lasMessage, currentChat, onSend }) => {
  const [currentModel] = useAtom(currentModelAtom);
  const actions = [
    {
      title: "文件",
      icon: <SolarPaperclip2Bold />,
      show: currentModel?.abillities.file,
    },
    {
      title: "图片",
      icon: <IcBaselinePhotoLibrary />,
      show: currentModel?.abillities.image,
    },
  ];
  const [text, setText] = useState<string>();
  const [brand] = useAtom(brandAtom);

  return (
    <div className="h-full flex flex-col pt-2 relative">
      <Textarea
        placeholder="Enter 发送; Shift + Enter 换行"
        value={text}
        onChange={(e) => setText(e.target.value)}
        isDisabled={
          !brand?.key ||
          (lasMessage?.status && lasMessage?.status !== "success")
        }
        minRows={1}
        startContent={
          <>
            <div className="flex gap-2 ">
              {actions
                .filter((v) => v.show)
                .map((action) => (
                  <Button
                    isIconOnly
                    size="sm"
                    key={action.title}
                    variant="light"
                    radius="sm"
                    className="text-large"
                  >
                    {action.icon}
                  </Button>
                ))}
            </div>
          </>
        }
        onKeyUp={(e) => {
          // 按回车发送 如shift 加 enter就不发送
          if (e.shiftKey) return;
          if (e.key === "Enter" && brand?.key) {
            if (text) {
              onSend(text);
              setText("");
            }
          }
        }}
        classNames={{
          input: "scrollbar",
        }}
        className="flex-1 scrollbar resize-none w-full  scrollbar px-4 py-1 outline-none"
      />
    </div>
  );
};

export default ChatInput;
