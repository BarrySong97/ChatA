import {
  IcBaselinePhotoLibrary,
  MaterialSymbolsGeneratingTokensOutline,
  SolarPaperclip2Bold,
} from "@/assets/icon";
import { brandAtom, currentModelAtom } from "@/atom";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { Chat } from "@prisma/client";
import { useAtom } from "jotai";
import { FC, useState } from "react";
export interface ChatInputProps {
  onSend: (text: string) => void;
  currentChat?: Chat;
}
const ChatInput: FC<ChatInputProps> = ({ currentChat, onSend }) => {
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
      <Input
        placeholder="开启你的对话之旅！"
        value={text}
        onChange={(e) => setText(e.target.value)}
        isDisabled={!brand?.key}
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
          // 按回车发送
          if (e.key === "Enter" && brand?.key) {
            if (text) {
              onSend(text);
              setText("");
            }
          }
        }}
        className="flex-1 resize-none w-full  scrollbar px-4 py-1 outline-none"
      />
    </div>
  );
};

export default ChatInput;
