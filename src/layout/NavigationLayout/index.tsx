import DragTitle from "@/components/DragTitle";
import { NextUIProvider } from "@nextui-org/react";
import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Side from "./components/side";
import TrafficLight from "@/components/TrafficLight";
import { MAIN_SEND_RENDER_KEYS } from "@/constant";
export interface AppLayoutProps {}
const AppLayout: FC<AppLayoutProps> = () => {
  const navigate = useNavigate();
  const isMac = window.platform.getOS() === "darwin";
  useEffect(() => {
    window.ipcRenderer.on(MAIN_SEND_RENDER_KEYS.PRISMA_ERROR, (...props) => {
      console.log(props);
    });
  }, []);
  return (
    <NextUIProvider navigate={navigate}>
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`bg-[#F3F3F4] app-draggable h-screen w-[64px] ${
            isMac ? "pt-4" : "PT-2"
          } flex flex-col items-center`}
        >
          <Side />
        </aside>
        <div className="flex-1 relative">
          <div
            style={{
              width: "100%",
            }}
            className="relative h-6"
          >
            <DragTitle className="absolute z-[99] top-0 w-full  py-3 flex justify-end  ">
              <TrafficLight isDev={false} />
            </DragTitle>
          </div>
          <div className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default AppLayout;
