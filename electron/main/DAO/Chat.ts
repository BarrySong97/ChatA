import { CHAT_SERVICE } from "../../../src/constant";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ipcMain } from "electron";

export class ChatService {
  // 初始化一些绑定的事件到main window上, ts上可以直接在构造函数的参数初始化

  constructor(
    private prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.initHandler();
  }
  // 获取所有chat
  [CHAT_SERVICE.ALLCHATS]() {
    return this.prisma.chat.findMany();
  }

  // 注册通信事件，就是上面这些枚举配置的函数
  initHandler() {
    for (const value of Object.values(CHAT_SERVICE)) {
      ipcMain.handle(value, (_, ...args) => {
        const res = (this[value] as (...aggs: any) => void)(...args);
        return res;
      });
    }
  }
}
