// const key = "sk-5n4MzJyFRG1ntcVGn8FbPcu6pLPBiUz29TrUKwXnebfZJfcb";
import OpenAI from "openai";
import { BrowserWindow } from "electron";
import { GeneralMessageSend } from "../../src/api/models/Chat";
export class KIMI {
  static baseUrl = "https://api.moonshot.cn";
  static API_KEY = "e86d17631e717f545c2079b216e0843d.pURjQfxLu8VIVx49";
  static stop = false;
  public static async getCompletions({
    key,
    model,
    messages,
    window,
    messageId,
    chatId,
  }: {
    key: string;
    model: string;
    chatId: string;
    messageId: string;
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
    KIMI.stop = false;
    for await (const chunk of response as any) {
      const text = chunk.choices[0].delta.content;

      if (text && !KIMI.stop) {
        totalText += text;
        window?.webContents.send(`completions`, {
          text: totalText,
          done: false,
          messageId,
          chatId,
        });
      }
    }
    if (!KIMI.stop) {
      window?.webContents.send(`completions`, {
        text: totalText,
        messageId,
        done: true,
        chatId,
      });
    }
    return totalText;
  }
}
