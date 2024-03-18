import { Chat } from "@/api/models/Chat";
import { Button, Divider, Input, ScrollShadow } from "@nextui-org/react";
import { FC, useState } from "react";
import { clsx } from "clsx";
import { SolarAddSquareLineDuotone } from "@/assets/icon";
import { Dropdown, Empty, MenuProps, message } from "antd";
import { ChatService } from "@/api/services/ChatService";
import { useQueryClient } from "react-query";

export interface ChatListProps {
  data?: Chat[];
  onChange: (chat?: Chat) => void;
  selectChat?: Chat;
}
const ChatList: FC<ChatListProps> = ({ selectChat, data, onChange }) => {
  const queryClient = useQueryClient();
  const onDeleteChat = async (id: string) => {
    try {
      await ChatService.deleteChat(id);
      queryClient.setQueryData("chats", (data: Chat[] = []) => {
        const filter = data?.filter((chat) => chat.id !== id);
        if (selectChat?.id === id) {
          onChange(filter?.[0]);
        }
        return filter;
      });
      if (selectChat?.id === id) {
        onChange(undefined);
      }
      message.success("删除成功");
    } catch (error) {
      message.warning("删除失败");
    } finally {
    }
  };
  const items: MenuProps["items"] = [
    {
      label: "编辑",
      key: "edit",
    },
    {
      label: "删除",
      key: "delete",
    },
  ];
  const addNewChat = () => {
    onChange(undefined);
  };
  return (
    <>
      <div className="no-drag flex mt-4  pb-2  justify-between px-2 gap-2  ">
        <Input
          placeholder="搜索消息"
          radius="sm"
          labelPlacement="outside"
          size="sm"
        />
        <Button onClick={addNewChat} variant="light" size="sm" isIconOnly>
          <SolarAddSquareLineDuotone className="text-lg" />
        </Button>
      </div>
      {!data?.length ? (
        <div
          style={{ height: "calc(100vh - 64px)" }}
          className="flex justify-center items-center"
        >
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            className="flex flex-col items-center justify-center"
            description={<span>会话列表为空</span>}
          >
            {/* <Button size="sm" variant="flat">
              立即创建
            </Button> */}
          </Empty>
        </div>
      ) : (
        <ScrollShadow
          style={{ height: "calc(100vh - 64px)" }}
          className=" px-2 overflow-auto scrollbar "
        >
          {data?.map((chat) => {
            const chatlistClassName = clsx(
              "rounded-md text-sm cursor-pointer p-1 px-2 hover:transition-colors hover:bg-primary/20 hover:text-primary",
              {
                "bg-primary/20 text-primary": chat.id === selectChat?.id,
              }
            );
            return (
              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => {
                    switch (key) {
                      case "delete":
                        onDeleteChat(chat.id);
                        break;
                    }
                  },
                }}
                trigger={["contextMenu"]}
              >
                <div
                  key={chat.id}
                  onClick={() => {
                    onChange(chat);
                  }}
                  className={chatlistClassName}
                >
                  {chat.title}
                </div>
              </Dropdown>
            );
          })}
        </ScrollShadow>
      )}
    </>
  );
};

export default ChatList;
