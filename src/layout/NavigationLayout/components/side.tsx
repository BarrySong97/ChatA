import {
  IconParkSolidAllApplication,
  MaterialSymbolsToolsWrench,
  SolarChatLineBold,
  SolarFolderBold,
  SolarLogout2Bold,
  SolarSettingsBold,
} from "@/assets/icon";
import { ipcDevtoolMain, ipcSignout } from "@/service/ipc";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export interface SideProps {}
const Side: FC<SideProps> = () => {
  const menuList = [
    {
      key: "chats",
      href: "/",
      title: "Chats",
      icon: <SolarChatLineBold />,
    },
    {
      key: "app",
      href: "/app",
      title: "Application",
      icon: <IconParkSolidAllApplication />,
    },
    {
      key: "setting",
      href: "/setting",
      title: "Setting",
      icon: <SolarSettingsBold />,
    },
  ];
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <div className="no-drag h-screen flex flex-col justify-between pb-4 ">
      <div className="flex flex-col justify-center items-center">
        {menuList.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.includes("setting") && item.href.includes("setting"));

          return (
            <Tooltip key={item.key} placement={"right"} content={item.title}>
              <Button
                // style={{
                //   backgroundColor: isActive
                //     ? "hsl(var(--nextui-default) / 0.4)"
                //     : "",
                // }}
                color={isActive ? "primary" : "default"}
                onClick={() => {
                  navigate(item.href);
                }}
                // href={item.href}
                className="py-6"
                radius="none"
                size="sm"
                variant="light"
              >
                <span className="text-lg " style={{}}>
                  {item.icon}
                </span>
              </Button>
            </Tooltip>
          );
        })}
      </div>

      <div>
        {window.platform.isProduction() ? null : (
          <Tooltip placement={"right"} content={"Dev Tool"}>
            <Button
              onClick={ipcDevtoolMain}
              className=" "
              radius="none"
              size="sm"
              variant="light"
            >
              <span className="text-lg text-default-700" style={{}}>
                <MaterialSymbolsToolsWrench />
              </span>
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Side;
