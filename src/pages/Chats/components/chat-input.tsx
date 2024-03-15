import {
  CarbonModelAlt,
  IcBaselinePhotoLibrary,
  MaterialSymbolsGeneratingTokensOutline,
  SolarPaperclip2Bold,
} from "@/assets/icon";
import { Button, Textarea, Tooltip } from "@nextui-org/react";
import React, { FC } from "react";
export interface ChatInputProps {}
const ChatInput: FC<ChatInputProps> = () => {
  const actions = [
    // {
    //   title: "模型",
    //   icon: <CarbonModelAlt />,
    // },
    // {
    //   title: "token",
    //   icon: <MaterialSymbolsGeneratingTokensOutline />,
    // },
    {
      title: "文件",
      icon: <SolarPaperclip2Bold />,
    },
    {
      title: "图片",
      icon: <IcBaselinePhotoLibrary />,
    },
  ];
  return (
    <div className="h-full flex flex-col pt-2 relative">
      <div className="flex gap-2 px-4 pl-2">
        {actions.map((action) => (
          <Tooltip content={action.title}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="sm"
              className="text-large"
              key={action.title}
            >
              {action.icon}
            </Button>
          </Tooltip>
        ))}
      </div>
      <textarea
        placeholder="输入你的信息"
        className="flex-1 resize-none w-full  scrollbar px-4 py-1 outline-none"
      />
      <Button
        color="primary"
        size="sm"
        variant="solid"
        className="w-[32px] self-end mr-4 mt-1 mb-2"
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;
