import { Message } from "@/api/models/Chat";
import { CodeBlock } from "@/components/CodeBlock";
import { FC } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Avatar } from "@nextui-org/react";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
import UserLogo from "@/assets/grinning-face.webp";
export interface MessageItemProps {
  data: Message;
}
const MessageItem: FC<MessageItemProps> = ({ data }) => {
  const [brand] = useAtom(brandAtom);
  const renderUser = () => {
    return (
      <div className="flex flex-row-reverse gap-3 mb-8 justify-start">
        <div className="mb-1">
          <Avatar isBordered radius="sm" name="U" />
        </div>
        <div className="p-2 prose   max-w-[80%] bg-primary rounded-md text-primary-foreground">
          <p>{data.content}</p>
        </div>
      </div>
    );
  };
  const renderAssist = () => {
    return (
      <div className="flex gap-3 max-w-[80%] mb-8">
        <div className="mb-1">
          <Avatar
            color="primary"
            isBordered
            radius="sm"
            src={brand?.icon ?? ""}
          />
        </div>
        <div className="bg-primary-50 prose  text-primary-900  rounded-md p-2 shadow-sm ">
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
