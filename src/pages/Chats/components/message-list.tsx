import { FC, useCallback, useEffect, useState } from "react";
import MessageItem from "./message-item";
import { Chat, Message } from "@/api/models/Chat";
import { brandAtom } from "@/atom";
import { useAtom } from "jotai";
import KeyInput from "./key-input";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import React from "react";
import { Button } from "@nextui-org/react";
import { SolarMapArrowDownBold, SolarMapArrowUpBold } from "@/assets/icon";
import _ from "lodash";
export interface MessageListProps {
  chat?: Chat;
  data?: Message[];
  onStop?: () => void;
  onRetry?: () => void;
  showActions?: boolean;
}
const MessageList: FC<MessageListProps> = ({
  showActions = true,
  onRetry,
  onStop,
  data,
}) => {
  const [brand] = useAtom(brandAtom);
  const scrollRef = React.useRef<VirtuosoHandle>(null);
  const [key, setKey] = useState<string>();
  const isBottomRef = React.useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);

  const scrollToBottom = useCallback(
    _.debounce(() => {
      scrollRef.current?.scrollToIndex({
        index: "LAST",
        align: "end",
        offset: 30,
      });
    }, 25),
    []
  );
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToIndex({
      index: 0,
      align: "start",
    });
  }, []);
  useEffect(() => {
    // 正在输出中的文字，需要特殊判断
    const lasMessage = data?.[data.length - 1];
    // 当最后一条消息状态正在打字的时候需要特殊判断
    if (lasMessage?.status === "typing") {
      // 如果用户向上滚动那么就停止滚动到最下面
      if (isBottomRef.current) {
        scrollToBottom();
      }
    } else {
      // 如果是其他状态直接滚动到最底下即可
      // scrollToBottom(
      scrollRef.current?.scrollToIndex({
        index: "LAST",
        align: "end",
        offset: 30,
      });
    }
  }, [data]);

  return brand?.key && data ? (
    <>
      <div className="absolute bottom-20 flex right-6 gap-2 z-[100]">
        {!isAtBottom ? (
          <Button isIconOnly size="sm" variant="flat" onClick={scrollToBottom}>
            <SolarMapArrowDownBold />
          </Button>
        ) : null}{" "}
        {!isAtTop ? (
          <Button isIconOnly size="sm" variant="flat" onClick={scrollToTop}>
            <SolarMapArrowUpBold />
          </Button>
        ) : null}
      </div>
      <Virtuoso
        style={{ height: "100%" }}
        data={data}
        ref={scrollRef}
        className="overflow-auto  scrollbar "
        atBottomStateChange={(v) => {
          isBottomRef.current = v;
          setIsAtBottom(v);
        }}
        overscan={1000}
        atTopStateChange={(v) => {
          setIsAtTop(v);
        }}
        itemContent={(index, v) => {
          const isLast = index === (data?.length ?? 0) - 1;

          return (
            <MessageItem
              onRetry={onRetry}
              isLast={isLast}
              showActions={showActions}
              onStop={onStop}
              key={v.id}
              data={v as Message}
            />
          );
        }}
      />
    </>
  ) : (
    <KeyInput value={key} setKey={setKey} type="page" />
  );
};

export default MessageList;
