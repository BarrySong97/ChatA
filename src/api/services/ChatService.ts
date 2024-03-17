import { ChatDAO } from "@/DAO/Chat";
import { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { Chat } from "../models/Chat";
import { CHAT_SERVICE } from "@/constant";

export class ChatService {
  /**
   *
   * @param params 聊天接口
   * @returns
   */
  public static chat(): Promise<Chat[]> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.ALLCHATS);
  }
}
