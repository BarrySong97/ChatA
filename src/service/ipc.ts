import { IPC_EVENT_KEYS, ProjectStage, TRAFFIC_LIGHT } from "@/constant";
// 处理需要和main process交互的通讯

const ipcRenderer = window.ipcRenderer;
function ipcSendPromise(channel: string, ...args: any[]) {
  return new Promise((resolve, reject) => {});
}

// 第一次打开检查是否登录, 登录就跳转到主页，或者跳转到上次操作过的界面
export function ipcCheckLogin() {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.CHECK_SIGN_IN);
}

// 从登录界面来的直接登录，并且跳转到项目页
export function ipcSign() {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.SIGN_IN);
}

// 退出登录
export function ipcSignout() {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.SIGN_OUT);
}

// 打开开发者工具, 主窗口
export function ipcDevtoolMain() {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.DEV_TOOL);
}

// 打开开发者工具, 项目页
export function ipcDevtoolProject() {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.DEV_TOOL);
}

// 打开一个新项目
export function ipcOpenProject(projectId: string, stage: ProjectStage) {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.OPEN_PROJECT, projectId, stage);
}

// 当操作右上角的自定义trafficlight的时候
export function ipcWindowResize(action: TRAFFIC_LIGHT) {
  return ipcRenderer.invoke(IPC_EVENT_KEYS.WINDOW_RESIZE, action);
}
