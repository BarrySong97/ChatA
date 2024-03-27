import { Message } from "@/api/models/Chat";
import { CodeBlock } from "@/components/CodeBlock";
import { FC } from "react";
import ReactLoading from "react-loading";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
import { Avatar, message } from "antd";
import { Button } from "@nextui-org/react";
import {
  MaterialSymbolsImageOutline,
  SolarCopyOutline,
  SolarRefreshBold,
  SolarStopCircleBold,
} from "@/assets/icon";

export interface MessageItemProps {
  data: Message;
  onStop: () => void;
  onRetry: () => void;
  isLast: boolean;
}
const MessageItem: FC<MessageItemProps> = ({
  isLast,
  data,
  onStop,
  onRetry,
}) => {
  const [brand] = useAtom(brandAtom);

  const actions = [
    {
      title: "复制",
      icon: <SolarCopyOutline />,
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(data.content);
          message.success("复制成功");
        } catch (error) {
          message.error("复制失败");
        }
      },
      show: true,
    },
    {
      title: "再试一次",
      icon: <SolarRefreshBold />,
      onclick: onRetry,
      show: isLast,
    },
    {
      title: "截图",
      icon: <MaterialSymbolsImageOutline />,
      onclick: () => {},
      show: true,
    },
  ];
  const renderUser = () => {
    return (
      <div className="flex flex-row-reverse gap-3 mb-8 justify-start">
        <div className="mb-1">
          <Avatar size={"large"} shape="square">
            U
          </Avatar>
        </div>
        <div className="p-2 prose   max-w-[50%] bg-primary rounded-md text-primary-foreground">
          <p>{data.content}</p>
        </div>
      </div>
    );
  };
  const renderAssist = () => {
    return (
      <div className="mb-8">
        <div className="flex  gap-3 justify-start  ">
          <div className="mb-1 relative">
            <Avatar size={"large"} shape="square" src={brand?.icon!} />
          </div>
          <div className="bg-primary-50 prose max-w-[50vw]  relative   text-primary-900  rounded-md p-2 shadow-sm ">
            {data.status === "sending" ? (
              <ReactLoading color={"#bac4d4"} height={32} width={32} />
            ) : null}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      lightMode={"dark"}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <table className="border-collapse border border-black dark:border-white py-1 px-3">
                      {children}
                    </table>
                  );
                },
                th({ children }) {
                  return (
                    <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border border-black dark:border-white break-words py-1 px-3">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {data.content}
            </ReactMarkdown>
            {!data.status ||
            data.status === "success" ||
            data.status === "error" ? (
              <div className="flex justify-end">
                {actions
                  .filter((v) => v.show)
                  .map((action, index) => {
                    return (
                      <Button
                        key={index}
                        size="sm"
                        onClick={action.onclick}
                        startContent={
                          <span className="text-large">{action.icon}</span>
                        }
                        className="mt-2 text-default-600"
                        variant="light"
                      >
                        {action.title}
                      </Button>
                    );
                  })}
              </div>
            ) : null}
          </div>
        </div>
        {data.status === "typing" ? (
          <div className="flex justify-start pl-12">
            <Button
              startContent={<SolarStopCircleBold className="text-xl" />}
              className="mt-2"
              onClick={onStop}
              variant="flat"
            >
              停止生成
            </Button>
          </div>
        ) : null}
      </div>
    );
  };
  return data.role === "user" ? renderUser() : renderAssist();
};

export default MessageItem;
