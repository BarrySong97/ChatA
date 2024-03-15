import { createHashRouter } from "react-router-dom";
import AppLayout from "./layout/NavigationLayout";
import Setting from "./pages/Setting";
import General from "./pages/Setting/components/General";
import Appearance from "./pages/Appearance";
import Advanced from "./pages/Advanced";
import About from "./pages/About";
import Chats from "./pages/Chats/inex";
import Application from "./pages/Application";

const router = createHashRouter([
  // 导航界面路由
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Chats />,
      },
      {
        path: "app",
        element: <Application />,
      },
      {
        path: "setting",
        element: <Setting />,
        children: [
          {
            index: true,
            element: <General />,
          },
          {
            path: "appearance",
            element: <Appearance />,
          },
          {
            path: "advanced",
            element: <Advanced />,
          },
          {
            path: "about",
            element: <About />,
          },
        ],
      },
    ],
  },
]);
export default router;
