import { Chat, GeneralMessageSend, Message } from "../models/Chat";
import { CHAT_SERVICE } from "@/constant";

export class ChatService {
  /**
   *
   * @param params 获取对话列表
   * @returns
   */
  public static listChat(brandId?: string): Promise<Chat[]> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.ALLCHATS, brandId);
  }
  /**
   *
   * @param params 创建chat
   * @returns
   */
  public static createChat(
    title: string,
    brandId: string,
    chatId: string
  ): Promise<Chat> {
    return window.ipcRenderer.invoke(
      CHAT_SERVICE.CREATE_CHAT,
      title,
      brandId,
      chatId
    );
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
  public static insertMessage(message: Partial<Message>): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.INSERT_MESSAGE, message);
  }

  /**
   * 发送消息
   */
  public static sendMessage(data: {
    messages: Partial<Message>[];
    text: string;
    chatId: string;
    sendId: string;
    deleteId?: string; // 用来删除已经生成的数据
    model: string;
    key: string;
    retry?: boolean;
    messageId: string;
    brandKey: string;
  }): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.SEND_MESSAGE, data);
  }

  /**
   * 编辑chat
   */
  public static editChat(data: {
    id: string;
    title: string;
  }): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.EDIT_CHAT, data);
  }

  /**
   * 编辑消息
   *
   */
  public static editMessage(data: {
    id: string;
    content: string;
  }): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.EDIT_MESSAGE, data);
  }

  /**
   * 禁止发送消息
   */
  public static stop(): Promise<Message> {
    return window.ipcRenderer.invoke(CHAT_SERVICE.STOP_SEND);
  }
}
