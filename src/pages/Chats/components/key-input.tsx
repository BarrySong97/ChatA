import { EyeFilledIcon, EyeSlashFilledIcon } from "@/assets/icon";
import { brandAtom } from "@/atom";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import React, { FC, useEffect, useState } from "react";
export interface KeyInputProps {
  type: "modal" | "page";
  value?: string;
  setKey: (key?: string) => void;
}
const KeyInput: FC<KeyInputProps> = ({ type, value, setKey }) => {
  const contentClassName = clsx("flex gap-2 items-center", {
    "w-[380px]": type === "page",
    "w-full": type === "modal",
  });
  const [brand, setBrand] = useAtom(brandAtom);
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  useEffect(() => {
    if (brand) {
      const key = window.localStorage.getItem(`${brand.name}-key`) ?? "";
      setKey(key);
    }
  }, [brand]);
  return (
    <div className="h-full w-full ">
      <div className="flex flex-col justify-center items-center h-full">
        {type === "page" ? (
          <>
            <div className="text-large  font-bold mb-1">
              {brand?.name} API KEY
            </div>
            <div className="text-tiny mb-2 text-zinc-400">本地存储</div>
          </>
        ) : null}
        <div className={contentClassName}>
          <Input
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            value={value}
            type={isVisible ? "text" : "password"}
            onChange={(e) => setKey(e.target.value)}
            size={type === "page" ? "sm" : "md"}
            label={type === "page" ? undefined : "请输入你的Key"}
            placeholder={type === "page" ? "请输入你的Key" : undefined}
            variant="flat"
            radius="sm"
            autoFocus
          />
          {type === "page" ? (
            <Button
              isDisabled={!value}
              onClick={() => {
                if (brand && value) {
                  brand.key = value;
                  setBrand({ ...brand });
                  window.localStorage.setItem(`${brand.name}-key`, value);
                }
              }}
              radius="sm"
              size="sm"
              variant="flat"
            >
              开启对话
            </Button>
          ) : null}
        </div>
        {type === "page" ? (
          <div className="mt-4 grid grid-cols-2 gap-2 w-[380px]">
            <Card
              radius="sm"
              isPressable
              onPress={() => window.open(brand?.info.where.link, "_blank")}
              shadow="sm"
            >
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-md font-semibold">
                    {brand?.info.where.title}
                  </p>
                  <p className="text-small text-default-500">
                    {brand?.info.where.text}
                  </p>
                </div>
              </CardBody>
            </Card>
            <Card
              radius="sm"
              isPressable
              onPress={() => window.open(brand?.info.api.link, "_blank")}
              shadow="sm"
            >
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-medium font-semibold">
                    {brand?.info.api.title}
                  </p>
                  <p className="text-small text-default-500">
                    {brand?.info.api.text}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KeyInput;
