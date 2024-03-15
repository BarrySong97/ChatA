import { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { Chat } from "../models/Chat";

export class ChatService {
  /**
   *
   * @param params 聊天接口
   * @returns
   */
  public static chat(): CancelablePromise<Chat[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/chats",
    });
  }
}
