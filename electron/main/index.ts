import { app, BrowserWindow, ipcMain, shell } from "electron";
import { release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { update } from "./update";
import { MAIN_SEND_RENDER_KEYS } from "../../src/constant";
import { AppManager } from "./AppManager";
import pkg from "@prisma/client";
import { ChatService } from "./DAO/Chat";
import fs from "node:fs";
import path from "node:path";
import { fork } from "node:child_process";

const { PrismaClient } = pkg;
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

const MainWindowSize = {
  width: 981,
  height: 710,
  minWidth: 1050,
  minHeight: 710,
};
type LiveWindow = {
  main: BrowserWindow | null; // 登录，项目导航，设置界面都在这个里面
  projects: Map<string, BrowserWindow>; // 单独打开的项目都在这个里面
};
const LiveWindow: LiveWindow = {
  main: null,
  projects: new Map(),
};
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
const isDev = url;
const dbPath = isDev
  ? join(__dirname, "../../prisma/chata.db")
  : path.join(app.getPath("userData"), "chata-prod.db");
// prisma 迁移
export const platformToExecutables: any = {
  win32: {
    schemaEngine: "node_modules/@prisma/engines/schema-engine-windows.exe",
    queryEngine: "node_modules/@prisma/engines/query_engine-windows.dll.node",
  },
  linux: {
    schemaEngine:
      "node_modules/@prisma/engines/schema-engine-debian-openssl-1.1.x",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node",
  },
  darwin: {
    schemaEngine: "node_modules/@prisma/engines/schema-engine-darwin",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-darwin.dylib.node",
  },
  darwinArm64: {
    schemaEngine: "node_modules/@prisma/engines/schema-engine-darwin-arm64",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node",
  },
};
const extraResourcesPath = process.resourcesPath; // impacted by extraResources setting in electron-builder.yml

const schmemaPath = path.join(extraResourcesPath, "prisma/schema.prisma");
function getPlatformName(): string {
  const isDarwin = process.platform === "darwin";
  if (isDarwin && process.arch === "arm64") {
    return process.platform + "Arm64";
  }

  return process.platform;
}

const platformName = getPlatformName();

export const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].schemaEngine
);
export const qePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].queryEngine
);

export async function runPrismaCommand({
  command,
  dbUrl,
  win,
}: {
  command: string[];
  dbUrl: string;
  win?: BrowserWindow;
}): Promise<number> {
  try {
    const exitCode = await new Promise((resolve, _) => {
      const prismaPath = path.join(
        extraResourcesPath,
        "node_modules/prisma/build/index.js"
      );
      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_SCHEMA_ENGINE_BINARY: mePath,
          PRISMA_QUERY_ENGINE_LIBRARY: qePath,
        },
        stdio: "inherit",
      });
      let fullOutput = "";

      child.on("error", (err: any) => {
        console.error("Child process got error:", err);
      });

      child.on("close", (code: any, signal: any) => {
        resolve(code);
      });
    });

    if (exitCode !== 0)
      throw Error(`command ${command} failed with exit code ${exitCode}`);

    return exitCode;
  } catch (e) {
    win?.webContents.send(MAIN_SEND_RENDER_KEYS.PRISMA_ERROR, e);
    console.error(e);
    throw e;
  }
}
if (!isDev) {
  try {
    // database file does not exist, need to create
    fs.copyFileSync(
      join(process.resourcesPath, "prisma/prod.db"),
      dbPath,
      fs.constants.COPYFILE_EXCL
    );
    console.log("New database file created");
  } catch (err: any) {
    if (err.code != "EEXIST") {
      console.error(`Failed creating sqlite file.`, err);
    } else {
      console.log("Database file detected");
    }
  }
}
const isMac = process.platform === "darwin";
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    titleBarStyle: "hidden",
    ...MainWindowSize,
    webPreferences: {
      preload,
      // nodeIntegration: true,
      // 开启沙箱 和上下文隔离
      // contextIsolation: true,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
    },
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (url != win?.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:") || url.startsWith("http:"))
      shell.openExternal(url);
    return { action: "deny" };
  });
  trafficLightListener(win);
  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", async () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  const prismaClient = isDev
    ? new PrismaClient({
        datasources: {
          db: {
            url: `file:${dbPath}`,
          },
        },
      })
    : new PrismaClient({
        __internal: {
          engine: {
            // @ts-expect-error internal prop
            binaryPath: qePath,
          },
        },
        datasources: {
          db: {
            url: `file:${dbPath}`,
          },
        },
      });
  // 迁移数据库结构
  if (!isDev) {
    win?.webContents.send(MAIN_SEND_RENDER_KEYS.PRISMA_ERROR, "1");
    await runPrismaCommand({
      command: ["migrate", "deploy", "--schema", schmemaPath],
      dbUrl: `file:${dbPath}`,
    });
  }
  // 把所有通信的代码都挂载上面
  new AppManager(win, new Map(), indexHtml, preload, url);
  new ChatService(prismaClient);
  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
