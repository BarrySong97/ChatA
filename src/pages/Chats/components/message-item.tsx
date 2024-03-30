import { Chat, Message } from "@/api/models/Chat";
import { CodeBlock } from "@/components/CodeBlock";
import React, { FC, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
import { Avatar, message } from "antd";
import { Button } from "@nextui-org/react";
import {
  MdiShare,
  SolarCopyOutline,
  SolarPenBold,
  SolarRefreshBold,
  SolarStopCircleBold,
} from "@/assets/icon";
import EditMessage from "./edit-message";
import clsx from "clsx";

export interface MessageItemProps {
  data: Message;
  onStop?: () => void;
  onRetry?: () => void;
  chat?: Chat;
  showActions?: boolean;
  isLast: boolean;
}
const MessageItem: FC<MessageItemProps> = ({
  isLast,
  data,
  showActions = true,
  onStop,
  onRetry,
}) => {
  const [brand] = useAtom(brandAtom);
  const [showModal, setShowModal] = useState(false);
  const commonActions = [
    {
      title: "编辑",
      icon: <SolarPenBold />,
      show: true,
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      title: "复制",
      icon: <SolarCopyOutline />,
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(data.content);
          message.success("复制成功");
        } catch (error) {
          message.error("复制失败");
        }
      },
      show: true,
    },
  ];
  const actions = [
    ...commonActions,
    {
      title: "再试一次",
      icon: <SolarRefreshBold />,
      onClick: onRetry,
      show: isLast,
    },
    {
      title: "分享",
      icon: <MdiShare />,
      onClick: () => {},
      show: true,
    },
  ];
  const renderUser = () => {
    const className = clsx(
      "flex  flex-row-reverse gap-3 pr-4 pb-2 justify-start",
      {
        "mb-8": !showActions,
        "mb-1": showActions,
      }
    );
    return (
      <div className={className}>
        <div className="mb-1">
          <Avatar size={"large"} shape="square">
            U
          </Avatar>
        </div>
        <div className="max-w-[50%] message-item">
          <div className="p-2 px-4 prose   bg-primary rounded-md text-primary-foreground">
            <p>{data.content}</p>
          </div>
          <div className="flex gap-2 justify-end message-action-items ">
            {showActions
              ? commonActions.map((action) => {
                  return (
                    <Button
                      size="sm"
                      onClick={action.onClick}
                      key={action.title}
                      style={
                        {
                          "--text-count": `${action.title.length}em`,
                          "--min-width": "var(--nextui-spacing-unit-16)",
                        } as React.CSSProperties
                      }
                      startContent={
                        <span className="message-action-item-icon text-base">
                          {action.icon}
                        </span>
                      }
                      className=" justify-center message-action-item   text-default-600 p-0"
                      variant="flat"
                    >
                      <div className="message-action-item-text">
                        {action.title}
                      </div>
                    </Button>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  };
  const renderAssist = () => {
    const className = clsx(
      {
        "mb-8": !showActions,
        "mb-1": showActions,
      },
      "pb-2"
    );
    return (
      <div className={className}>
        <div className="flex  gap-3 justify-start  ">
          <div className="mb-1 relative">
            <Avatar size={"large"} shape="square" src={brand?.icon!} />
          </div>

          <div className="message-item">
            <div
              className={
                showActions
                  ? "bg-primary-50 prose max-w-[60vw]  relative   text-primary-900  rounded-md p-2 px-4 shadow-sm "
                  : "bg-primary-50 prose max-w-[80%]  relative   text-primary-900  rounded-md p-2 px-4 shadow-sm "
              }
            >
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
            </div>
            {(!data.status ||
              data.status === "success" ||
              data.status === "error") &&
            showActions ? (
              <div className="message-action-items mt-0 flex gap-2 justify-start">
                {actions
                  .filter((v) => v.show)
                  .map((action, index) => {
                    return (
                      <Button
                        size="sm"
                        onClick={action.onClick}
                        style={
                          {
                            "--text-count": `${action.title.length}em`,
                            "--min-width":
                              action.title === "再试一次"
                                ? `var(--nextui-spacing-unit-24)`
                                : "var(--nextui-spacing-unit-16)",
                          } as React.CSSProperties
                        }
                        startContent={
                          <span className="message-action-item-icon text-base">
                            {action.icon}
                          </span>
                        }
                        key={index}
                        className=" justify-center message-action-item   text-default-600 p-0"
                        variant="flat"
                      >
                        <div className="message-action-item-text">
                          {action.title}
                        </div>
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
              size="sm"
              variant="flat"
            >
              停止生成
            </Button>
          </div>
        ) : null}
      </div>
    );
  };
  const User = useMemo(() => renderUser(), [data.id]);
  const Assitant = useMemo(
    () => renderAssist(),
    [data.id, data.status, data.content]
  );
  return (
    <>
      {data.role === "user" ? User : Assitant}
      <EditMessage
        message={data}
        isOpen={showModal}
        onOpenChange={(v) => setShowModal(v)}
      />
    </>
  );
};

export default MessageItem;
