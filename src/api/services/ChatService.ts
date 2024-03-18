import { Chat, GeneralMessageSend, Message } from "../models/Chat";
import { CHAT_SERVICE } from "@/constant";

export class ChatService {
  /**
   *
   * @param params 获取对话列表
   * @returns
   */
  public static listChat(): Promise<Chat[]> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.ALLCHATS);
  }
  /**
   *
   * @param params 创建chat
   * @returns
   */
  public static createChat(title: string): Promise<Chat> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.CREATE_CHAT, title);
  }

  /**
   * 删除chat
   *
   */
  public static deleteChat(id: string): Promise<boolean> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.DELETE_CHAT, id);
  }
  /**
   *
   * @param params 获取某个对话的消息
   * @returns
   */
  public static getMessageByChatId(id: string): Promise<Message[]> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.GET_MESSAGES, id);
  }

  /**
   * 插入消息
   */
  public static insertMessage(
    message: Partial<Message> & { totalTokens: number }
  ): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.INSERT_MESSAGE, message);
  }

  /**
   * 发送消息
   */
  public static sendMessage(
    messages: GeneralMessageSend,
    text: string,
    chatId: string
  ): Promise<Message> {
    return window.ipcRenderer.invoke(
      CHAT_SERVICE.SEND_MESSAGE,
      messages,
      text,
      chatId
    );
  }
}
