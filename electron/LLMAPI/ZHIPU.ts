import { BrowserWindow } from "electron";
import sign from "jwt-encode";
import { GeneralMessageSend } from "../../src/api/models/Chat";
import OpenAI from "openai";
export class ZHIPUAPI {
  static baseUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  static token = "";
  public static async getCompletions({
    messages,
    window,
    key,
    chatId,
    model,
  }: {
    key: string;
    model: string;
    chatId: string;
    messages: GeneralMessageSend;
    window: BrowserWindow | null;
  }) {
    if (!ZHIPUAPI.token) {
      const [id, secret] = key.split(".");
      const payload = {
        api_key: id,
        exp: 999999999999999,
        iat: +new Date(),
      };
      ZHIPUAPI.token = sign(payload, secret, {
        alg: "HS256",
        sign_type: "SIGN",
      });
    }
    const openai = new OpenAI({
      apiKey: ZHIPUAPI.token,
      baseURL: "https://open.bigmodel.cn/api/paas/v4",
    });
    const response = await openai.chat.completions.create({
      messages: messages as any,
      model,
      stream: true,
    });
    let totalText = "";

    for await (const chunk of response as any) {
      const text = chunk.choices[0].delta.content;
      if (text) {
        totalText += text;
        window?.webContents.send(`completions`, {
          text: totalText,
          done: false,
          chatId,
        });
      }
    }
    window?.webContents.send(`completions`, {
      text: totalText,
      done: true,
      chatId,
    });
    return totalText;
  }
}
