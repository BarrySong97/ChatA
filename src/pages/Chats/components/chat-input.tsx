import {
  CarbonModelAlt,
  IcBaselinePhotoLibrary,
  MaterialSymbolsGeneratingTokensOutline,
  SolarPaperclip2Bold,
  SolarQuestionCircleBroken,
} from "@/assets/icon";
import { ModelList } from "@/model";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { Chat } from "@prisma/client";
import { FC, useState } from "react";
import { Tooltip as AntDToolTip } from "antd";
export interface ChatInputProps {
  onSend: (text: string) => void;
  currentChat?: Chat;
}
const ChatInput: FC<ChatInputProps> = ({ currentChat, onSend }) => {
  const actions = [
    {
      title: "文件",
      icon: <SolarPaperclip2Bold />,
    },
    {
      title: "图片",
      icon: <IcBaselinePhotoLibrary />,
    },
  ];
  const [text, setText] = useState<string>();
  const renderToken = () => {
    const token = currentChat?.total_tokens ?? 0;
    if (token >= 0 && token < 10000) {
      return token;
    }
    if (token >= 10000) {
      // 用k来表示
      return ~~(token / 1000) + "k";
    }
  };
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
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              radius="sm"
              className="px-2 "
              startContent={<CarbonModelAlt className="text-large" />}
            >
              GPT-4
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {ModelList.map((brand, index) => {
              return (
                <DropdownSection
                  key={brand.name}
                  showDivider={index !== ModelList.length - 1}
                >
                  <DropdownItem
                    key={brand.name}
                    isReadOnly
                    data-hover={false}
                    className="opacity-100 hover:!bg-white cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={brand.icon} alt="" className="w-4 h-4" />
                        <div>{brand.name}</div>
                      </div>
                      <AntDToolTip
                        zIndex={9999999999}
                        placement="bottomRight"
                        title={brand.description}
                      >
                        <SolarQuestionCircleBroken />
                      </AntDToolTip>
                    </div>
                  </DropdownItem>
                  {brand.models.map((model) => {
                    return (
                      <DropdownItem key={model.name}>{model.name}</DropdownItem>
                    );
                  })}
                </DropdownSection>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <Button
          size="sm"
          color="warning"
          variant="flat"
          radius="sm"
          className="px-2 "
          startContent={
            <MaterialSymbolsGeneratingTokensOutline className="text-large" />
          }
        >
          token: {renderToken()}
        </Button>
      </div>
      <textarea
        placeholder="在这里打字，开启你的对话之旅！"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyUp={(e) => {
          // 按回车发送
          if (e.key === "Enter") {
            if (text) {
              onSend(text);
              setText("");
            }
          }
        }}
        className="flex-1 resize-none w-full  scrollbar px-4 py-1 outline-none"
      />
      <Button
        color="primary"
        size="sm"
        variant="solid"
        isDisabled={!text}
        className="w-[32px] self-end mr-4 mt-1 mb-2"
        onClick={() => {
          if (text) {
            onSend(text);
            setText("");
          }
        }}
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;
