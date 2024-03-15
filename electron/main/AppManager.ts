import {
  IPC_EVENT_KEYS,
  MAIN_SEND_RENDER_KEYS,
  ProjectStage,
  TRAFFIC_LIGHT,
} from "../../src/constant";
import { BrowserWindow, ipcMain } from "electron";

const isMac = process.platform === "darwin";
function resizeWindow(action: TRAFFIC_LIGHT) {
  const win = BrowserWindow.getFocusedWindow();
  switch (action) {
    case TRAFFIC_LIGHT.MAXIMIZE:
      win?.maximize();
      break;
    case TRAFFIC_LIGHT.MINIMIZE:
      win?.minimize();
      break;
    case TRAFFIC_LIGHT.RESTORE:
      win?.restore();
      break;
    case TRAFFIC_LIGHT.CLOSE:
      win?.close();
      break;
  }
}
function trafficLightListener(win?: BrowserWindow) {
  if (!isMac) {
    win?.on("maximize", () => {
      win?.webContents.send(MAIN_SEND_RENDER_KEYS.MAXIMIZE);
    });
    win?.on("restore", () => {
      win?.webContents.send(MAIN_SEND_RENDER_KEYS.RESTORE);
    });
    win?.on("resize", () => {
      if (!win?.isMaximized()) {
        win?.webContents.send(MAIN_SEND_RENDER_KEYS.RESTORE);
      }
    });
  }
}
const LoginWindowSize = {
  width: 321,
  height: 444,
};
const MainWindowSize = {
  width: 981,
  height: 710,
  minWidth: 981,
  minHeight: 710,
};
export class AppManager {
  // 初始化一些绑定的事件到main window上, ts上可以直接在构造函数的参数初始化
  constructor(
    private main: BrowserWindow, // 登录，项目导航，设置界面都在这个里面
    private projects: Map<string, BrowserWindow> = new Map(), // 单独打开的项目都在这个里面
    private indexHtml: string, // production 文件路径
    private preload: string, // preload 文件路径
    private url?: string // dev server url
  ) {
    trafficLightListener(this.main);
    this.initHandler();
  }
  // 登录修改主窗口大小
  [IPC_EVENT_KEYS.SIGN_IN]() {
    const mainWindow = this.main;
    mainWindow.setResizable(true);
    mainWindow.setMinimumSize(
      MainWindowSize.minWidth,
      MainWindowSize.minHeight
    );
    mainWindow.setSize(MainWindowSize.width, MainWindowSize.height);
    mainWindow.center();
  }
  // 退出修改主窗口大小
  [IPC_EVENT_KEYS.SIGN_OUT]() {
    const mainWindow = this.main;

    mainWindow.setMinimumSize(LoginWindowSize.width, LoginWindowSize.height);
    mainWindow.setSize(LoginWindowSize.width, LoginWindowSize.height);
    mainWindow.center();
    mainWindow.setResizable(false);
  }
  // 打开开发者工具
  [IPC_EVENT_KEYS.DEV_TOOL]() {
    BrowserWindow.getFocusedWindow()?.webContents.openDevTools({
      mode: "detach",
    });
  }
  // 当操作右上角的自定义trafficlight的时候
  [IPC_EVENT_KEYS.WINDOW_RESIZE](action: TRAFFIC_LIGHT) {
    resizeWindow(action);
  }

  // 注册通信事件，就是上面这些枚举配置的函数
  initHandler() {
    for (const value of Object.values(IPC_EVENT_KEYS)) {
      ipcMain.handle(value, (_, ...args) => {
        const res = (this[value] as (...aggs: any) => void)(...args);
        return res;
      });
    }
  }
}
