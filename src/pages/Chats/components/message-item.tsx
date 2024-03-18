import { Message } from "@/api/models/Chat";
import { CodeBlock } from "@/components/CodeBlock";
import React, { FC } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
export interface MessageItemProps {
  data: Message;
}
const MessageItem: FC<MessageItemProps> = ({ data }) => {
  const renderUser = () => {
    return (
      <div className="flex  flex-col items-end">
        <div className="mb-1">You</div>
        <div className="p-2 max-w-[80%] bg-primary rounded-md text-primary-foreground">
          {data.content}
        </div>
      </div>
    );
  };
  const renderAssist = () => {
    return (
      <div>
        <div className="mb-1">Chatbot</div>
        <div className="bg-primary-50 text-primary-900  rounded-md p-2 shadow-sm max-w-[80%]">
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
      </div>
    );
  };
  return <div>{data.role === "user" ? renderUser() : renderAssist()}</div>;
};

export default MessageItem;
