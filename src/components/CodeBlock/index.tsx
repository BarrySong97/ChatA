import { Button } from "@nextui-org/react";
import { FC } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { SolarCopyOutline } from "@/assets/icon";
import { message } from "antd";

interface Props {
  language: string;
  value: string;
  lightMode: "light" | "dark";
}

export const CodeBlock: FC<Props> = ({ language, value, lightMode }) => {
  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      message.success("已复制到剪切板");
    });
  };
  return (
    <div className="codeblock relative font-sans text-[16px]">
      <div className="flex items-center justify-between ">
        <span className="text-xs lowercase text-white">{language}</span>
        <div className="flex items-center">
          <Button
            size="sm"
            className="text-white"
            isIconOnly
            variant="light"
            onClick={copyToClipboard}
          >
            <SolarCopyOutline className="text-medium" />
          </Button>
        </div>
      </div>

      <SyntaxHighlighter
        className="scrollbar"
        language={language}
        style={oneDark}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
