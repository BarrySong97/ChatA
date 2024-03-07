import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import "./demos/ipc";
import router from "./routes";
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </NextUIProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
