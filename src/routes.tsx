import { createHashRouter } from "react-router-dom";
import SignIn from "./pages/Signin";
import Projects from "./pages/Projects";
import AppLayout from "./layout/NavigationLayout";
import Setting from "./pages/Setting";
import General from "./pages/Setting/components/General";
import ProjectFileList from "./pages/ProjectFileList";
import ProjectChatbot from "./pages/ProjectChatbot";
import Appearance from "./pages/Appearance";
import Advanced from "./pages/Advanced";
import About from "./pages/About";

const router = createHashRouter([
  // 导航界面路由
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Projects />,
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
