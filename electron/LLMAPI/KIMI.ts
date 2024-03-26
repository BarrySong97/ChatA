// const key = "sk-5n4MzJyFRG1ntcVGn8FbPcu6pLPBiUz29TrUKwXnebfZJfcb";
import OpenAI from "openai";
import { BrowserWindow } from "electron";
import { GeneralMessageSend } from "../../src/api/models/Chat";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
export class KIMI {
  static baseUrl = "https://api.moonshot.cn";
  static API_KEY = "e86d17631e717f545c2079b216e0843d.pURjQfxLu8VIVx49";
  public static async getCompletions({
    key,
    model,
    messages,
    window,
  }: {
    key: string;
    model: string;
    messages: GeneralMessageSend;
    window: BrowserWindow | null;
  }) {
    const openai = new OpenAI({
      apiKey: key,
      baseURL: "https://api.moonshot.cn/v1",
    });
    const response = await openai.chat.completions.create({
      messages: messages as any,
      model,
      stream: true,
    });
    let totalText = "";
    let typingInterval: any = null; // 用于存储定时器ID，以便取消定时器
    let index = 0; // 当前打字的索引
    let typeText = "";
    const typeMessage = () => {
      const typeSpeed = 30; // 设置每个字符的打字速度（毫秒）

      // 清除之前的定时器
      clearInterval(typingInterval);
      typingInterval = setInterval(() => {
        if (index < totalText.length) {
          typeText += totalText[index++];
          window?.webContents.send("completions", {
            text: typeText,
            done: false,
          });
        } else {
          // 完成打字，清除定时器

          // 如果当前数据块已经打完，检查是否还有更多的数据块
          // 完成打字，清除定时器
          clearInterval(typingInterval);
        }
      }, typeSpeed);
    };
    for await (const chunk of response as any) {
      const text = chunk.choices[0].delta.content;
      const useage = chunk.choices[0].usage;
      if (text) {
        totalText += text;
        typeMessage();
      }
    }
    window?.webContents.send("completions", {
      text: totalText,
      done: true,
    });
  }
}
