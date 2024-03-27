import { Chat } from "@/api/models/Chat";
import { Tooltip as AntDToolTip, Dropdown } from "antd";
import { FC, Key, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { clsx } from "clsx";
import {
  CarbonModelAlt,
  SolarAddSquareLineDuotone,
  SolarQuestionCircleBroken,
} from "@/assets/icon";
import { Empty, MenuProps, message } from "antd";
import { ChatService } from "@/api/services/ChatService";
import { useQueryClient } from "react-query";
import { brandAtom, currentModelAtom } from "@/atom";
import {
  Dropdown as NextDropdown,
  Button,
  Input,
  ScrollShadow,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { BrandList, ModelItem } from "@/model";
import KeyInput from "./key-input";

export interface ChatListProps {
  data?: Chat[];
  onChange: (chat?: Chat) => void;
  selectChat?: Chat;
}
const ChatList: FC<ChatListProps> = ({ selectChat, data, onChange }) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [key, setKey] = useState<string>();
  const onDeleteChat = async (id: string) => {
    try {
      await ChatService.deleteChat(id);
      queryClient.setQueryData(["chats", brand?.id], (data: Chat[] = []) => {
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
      label: "删除",
      key: "delete",
    },
  ];
  const [brand, setBrand] = useAtom(brandAtom);
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const addNewChat = () => {
    onChange(undefined);
  };
  const height = "calc(100vh - 100px)";
  useEffect(() => {
    if (brand) {
      const json = window.localStorage.getItem(brand.name);
      const brandKey = window.localStorage.getItem(`${brand.name}-key`);
      brand.key = brandKey ?? "";
      setBrand(brand);
      if (json && json !== "undefined") {
        setCurrentModel(JSON.parse(json));
      } else {
        setCurrentModel(brand.models[0]);
        window.localStorage.setItem(
          brand.name,
          JSON.stringify(brand.models[0])
        );
      }
    }
  }, [brand]);
  const renderModels = (models: ModelItem[]) => {
    const list = models.map((model) => {
      return <DropdownItem key={model.name}>{model.name}</DropdownItem>;
    });
    const brandSetting = [
      <DropdownSection key={"setting"} title="设置" showDivider>
        <DropdownItem key="apiKey">API Key</DropdownItem>
      </DropdownSection>,
      <DropdownSection key="models" title="模型" showDivider>
        {list}
      </DropdownSection>,
    ];
    return brandSetting;
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
        <div style={{ height }} className="flex justify-center items-center">
          <Empty
            image={brand?.icon}
            imageStyle={{ height: 32, borderRadius: 8 }}
            className="flex flex-col items-center justify-center"
            description={
              <span className="text-zinc-400 text-tiny">会话列表为空</span>
            }
          >
            {/* <Button size="sm" variant="flat">
              立即创建
            </Button> */}
          </Empty>
        </div>
      ) : (
        <ScrollShadow
          style={{ height }}
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
                key={chat.id}
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
      <div className="px-2">
        {brand?.models ? (
          <NextDropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                color="default"
                variant="flat"
                radius="sm"
                className="px-2  w-full"
                startContent={<CarbonModelAlt className="text-large" />}
              >
                {currentModel?.name || "请选择模型"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={currentModel?.name ? [currentModel?.name] : []}
              selectionMode="single"
              disallowEmptySelection
              onSelectionChange={(k: "all" | Set<Key>) => {
                if (k !== "all") {
                  const arr = Array.from(k);
                  if (arr[0] === "apiKey") {
                    onOpen();
                    return;
                  }
                  const model = brand.models.find((m) => m.name === arr[0]);
                  if (model) {
                    window.localStorage.setItem(
                      brand.name,
                      JSON.stringify(model)
                    );
                    setCurrentModel(model);
                  }
                }
              }}
              aria-label="Static Actions"
            >
              {renderModels(brand.models)}
            </DropdownMenu>
          </NextDropdown>
        ) : null}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {brand?.key ? "修改" : "修改"} API KEY
              </ModalHeader>
              <ModalBody>
                <KeyInput value={key} setKey={setKey} type="modal" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (brand) {
                      window.localStorage.setItem(
                        `${brand.name}-key`,
                        key ?? ""
                      );
                      brand.key = key;
                      setBrand({ ...brand });
                    }
                    onClose();
                  }}
                >
                  {brand?.key ? "修改" : "添加"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatList;
