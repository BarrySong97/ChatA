import { CHAT_SERVICE } from "../../../src/constant";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { BrowserWindow, ipcMain } from "electron";
import { ZHIPUAPI } from "../../LLMAPI/ZHIPU";
import { GeneralMessageSend } from "../../../src/api/models/Chat";
import { KIMI } from "../../LLMAPI/KIMI";

export class ChatService {
  // 初始化一些绑定的事件到main window上, ts上可以直接在构造函数的参数初始化

  constructor(
    private prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.initHandler();
  }
  // 获取所有chat
  async [CHAT_SERVICE.ALLCHATS](brandId: string) {
    const res = await this.prisma.chat.findMany({
      where: {
        brand_id: brandId,
      },
    });
    return res.reverse();
  }

  // 创建chat
  [CHAT_SERVICE.CREATE_CHAT](title: string, brandId: string, id: string) {
    return this.prisma.chat.create({
      data: {
        id,
        title: title,
        brand_id: brandId,
      },
    });
  }
  // 删除chat
  [CHAT_SERVICE.DELETE_CHAT](id: string) {
    return this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }

  // 获取chat的message
  async [CHAT_SERVICE.GET_MESSAGES](id: string) {
    const res = await this.prisma.message.findMany({
      where: {
        chatId: id,
      },
    });

    return res;
  }
  // 发送消息
  async [CHAT_SERVICE.SEND_MESSAGE]({
    messages,
    text,
    sendId,
    chatId,
    model,
    key,
    lastId,
    retry,
    messageId,
    brandKey,
  }: {
    messages: GeneralMessageSend;
    text: string;
    chatId: string;
    model: string;
    sendId: string;
    messageId: string;
    id: string;
    retry: boolean;
    key: string;
    lastId: string;
    brandKey: string;
  }) {
    try {
      const window = BrowserWindow.getFocusedWindow();
      let responseText = "";
      if (retry && lastId !== "error") {
        await this.prisma.message.delete({
          where: {
            id: lastId,
          },
        });
      }
      switch (brandKey) {
        case "zhipu":
          responseText = await ZHIPUAPI.getCompletions({
            messages,
            window,
            key,
            chatId,
            model,
          });
          break;
        case "kimi":
          responseText = await KIMI.getCompletions({
            messages,
            window,
            chatId,
            key,
            model,
          });
      }

      await this.prisma.message.create({
        data: {
          id: messageId,
          content: text,
          role: "user",
          chatId: chatId,
        },
      });

      await this.prisma.message.create({
        data: {
          id: sendId,
          content: responseText,
          role: "assistant",
          chatId: chatId,
        },
      });
    } catch (error: any) {
      switch (brandKey) {
        case "zhipu":
          return {
            error: {
              ...error.error,
            },
          };
        case "kimi":
          return {
            error: {
              ...error.error,
            },
          };
      }
    }
  }
  // 插入消息
  async [CHAT_SERVICE.INSERT_MESSAGE](data: {
    role: string;
    content: string;
    chatId: string;
    totalTokens: number;
  }) {
    const res = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          role: data.role,
          content: data.content,
          chatId: data.chatId,
        },
      }),
      this.prisma.chat.update({
        where: { id: data.chatId },
        data: {
          total_tokens: {
            increment: data.totalTokens,
          },
        },
      }),
    ]);
    return res[0];
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
