import {
  IconParkSolidAllApplication,
  MaterialSymbolsToolsWrench,
  SolarSettingsBold,
} from "@/assets/icon";
import { brandAtom } from "@/atom";
import { BrandList } from "@/model";
import { ipcDevtoolMain } from "@/service/ipc";
import { Button, Tooltip } from "@nextui-org/react";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
export interface SideProps {}
const Side: FC<SideProps> = () => {
  const menuList = [
    // {
    //   key: "app",
    //   href: "/app",
    //   title: "应用",
    //   icon: <IconParkSolidAllApplication />,
    // },
    // {
    //   key: "setting",
    //   href: "/setting",
    //   title: "设置",
    //   icon: <SolarSettingsBold />,
    // },
  ];
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [brand, setBrand] = useAtom(brandAtom);
  useEffect(() => {
    const brandJson = window.localStorage.getItem("brand");
    if (brandJson) {
      const brand = JSON.parse(brandJson);
      setBrand(brand);
    } else {
      window.localStorage.setItem("brand", JSON.stringify(BrandList[0]));
      setBrand(BrandList[0]);
    }
  }, []);
  return (
    <div className="no-drag h-screen flex flex-col justify-between pb-4 ">
      <div className="flex flex-col gap-1 justify-center items-center pt-4">
        {BrandList.map((item) => {
          const isActive = brand?.name === item.name;

          return (
            <Tooltip
              key={item.name}
              placement={"bottom"}
              className="w-[200px]"
              // motionProps={{
              //   variants: {
              //     exit: {
              //       opacity: 0,
              //       transition: {
              //         duration: 0.1,
              //         ease: "easeIn",
              //       },
              //     },
              //     enter: {
              //       opacity: 1,
              //       transition: {
              //         duration: 0.15,
              //         ease: "easeOut",
              //       },
              //     },
              //   },
              // }}
              content={item.description}
            >
              <Button
                color={"primary"}
                onClick={() => {
                  setBrand(item);
                  window.localStorage.setItem("brand", JSON.stringify(item));
                }}
                className="py-6 relative"
                radius="none"
                size="sm"
                variant="light"
              >
                {isActive ? (
                  <div className="absolute bg-primary-500 h-full w-[4px] left-[1px]"></div>
                ) : null}
                <div className="flex items-center gap-2">
                  <img src={item.icon} alt="" className="w-8 h-8 rounded-md" />
                  {/* <div>{item.name}</div> */}
                </div>
              </Button>
            </Tooltip>
          );
        })}
      </div>

      <div>
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
