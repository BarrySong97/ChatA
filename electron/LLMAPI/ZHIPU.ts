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
          window?.webContents.send(`completions`, {
            text: typeText,
            done: false,
            chatId,
          });
        } else {
          // 完成打字，清除定时器

          // 如果当前数据块已经打完，检查是否还有更多的数据块
          // 完成打字，清除定时器
          clearInterval(typingInterval);
          window?.webContents.send(`completions`, {
            text: totalText,
            done: true,
            chatId,
          });
        }
      }, typeSpeed);
    };

    for await (const chunk of response as any) {
      const text = chunk.choices[0].delta.content;
      if (text) {
        totalText += text;
        typeMessage();
      }
    }
    return totalText;
  }
}
