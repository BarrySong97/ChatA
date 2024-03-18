import { BrowserWindow } from "electron";
import sign from "jwt-encode";
import { GeneralMessageSend } from "../../src/api/models/Chat";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
const [id, secret] = "e86d17631e717f545c2079b216e0843d.pURjQfxLu8VIVx49".split(
  "."
);
const payload = {
  api_key: id,
  exp: 999999999999999,
  iat: +new Date(),
};
export class ZHIPUAPI {
  static baseUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  static API_KEY = "e86d17631e717f545c2079b216e0843d.pURjQfxLu8VIVx49";
  static token = sign(payload, secret, {
    alg: "HS256",
    sign_type: "SIGN",
  });
  public static async getCompletions(
    messages: GeneralMessageSend,
    window: BrowserWindow | null
  ) {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        Authorization: ZHIPUAPI.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "GLM-4",
        stream: true,
        messages: messages,
      }),
    });
    const decoder = new TextDecoder();
    const totalText: string[] = [];
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;

        try {
          const json = JSON.parse(data);
          const text = json.choices[0].delta.content;
          const useage = json.usage;

          totalText.push(text);
          window?.webContents.send("completions", {
            text: totalText.join(""),
            totalTokens: useage?.total_tokens ?? 0,
          });
        } catch (e) {}
      }
    };

    const parser = createParser(onParse);

    for await (const chunk of response.body as any) {
      parser.feed(decoder.decode(chunk));
    }
  }
}
