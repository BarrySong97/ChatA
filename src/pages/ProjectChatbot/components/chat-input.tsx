import { SolarAddCircleBold, SolarRoundArrowUpBold } from "@/assets/icon";
import { Button, Input } from "@nextui-org/react";
import { Upload, UploadProps } from "antd";
import { FC } from "react";
export interface ChatInputProps {}
const ChatInput: FC<ChatInputProps> = () => {
  const props: UploadProps = {
    name: "file",
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
    },
  };
  return (
    <div className="flex gap-2 ">
      <Upload {...props}>
        <Button className="items-center" isIconOnly>
          <SolarAddCircleBold className="text-xl text-default-600" />
        </Button>
      </Upload>
      <Input
        size="md"
        radius="sm"
        labelPlacement="outside"
        className="flex-1"
      />
      <Button variant="solid" isIconOnly color="primary">
        <SolarRoundArrowUpBold className="text-xl  " />
      </Button>
    </div>
  );
};

export default ChatInput;
