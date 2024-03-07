import React, { useState } from "react";
import { Divider, Listbox, ListboxItem, cn } from "@nextui-org/react";
import {
  PajamasAppearance,
  SolarAltArrowRightLinear,
  SolarChatLineBold,
  SolarEmojiFunnySquareBoldDuotone,
  SolarMultipleForwardLeftBroken,
} from "@/assets/icon";
import { Outlet } from "react-router-dom";

export default function App() {
  const [selectKeys, setSelectKeys] = useState<string[]>(["General"]);
  const settingMenu = [
    {
      title: "General",
      href: "navigation/setting",
      icon: <SolarChatLineBold />,
      colorClass: "bg-success/10 text-success",
    },
    {
      title: "Appearance",
      href: "navigation/setting/appearance",
      icon: <PajamasAppearance />,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      title: "Advanced",
      href: "navigation/setting/advanced",
      icon: <SolarMultipleForwardLeftBroken />,
      colorClass: "bg-warning/10 text-warning",
    },
    {
      title: "About",
      href: "navigation/setting/about",
      icon: <SolarEmojiFunnySquareBoldDuotone />,
      colorClass: "bg-gray-500/10 text-gray",
    },
  ];

  return (
    <div className="flex">
      <aside className=" z-[100] h-screen py-2 pt-0">
        <Listbox
          aria-label="User Menu"
          className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 w-[190px] overflow-visible  h-screen"
          itemClasses={{
            base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 !rounded-none data-[hover=true]:bg-default-100/80",
          }}
        >
          {settingMenu.map((v) => {
            const isActive = selectKeys?.[0] === v.title;
            const props = isActive
              ? {
                  className: "!bg-default-100/80",
                }
              : {};

            return (
              <ListboxItem
                {...props}
                key={v.title}
                href={v.href}
                endContent={<SolarAltArrowRightLinear />}
                onClick={() => {
                  setSelectKeys([v.title]);
                }}
                startContent={
                  <div
                    className={cn(
                      v.colorClass,
                      "flex items-center rounded-small justify-center w-7 h-7"
                    )}
                  >
                    {v.icon}
                  </div>
                }
              >
                {v.title}
              </ListboxItem>
            );
          })}
        </Listbox>
      </aside>
      <Divider orientation="vertical" className="relative h-screen " />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
