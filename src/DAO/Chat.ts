import { Chat } from "@/api/models/Chat";

export class ChatDAO {
  /**
   *
   * @param params 聊天接口
   * @returns
   */
  public static getAllchat(): Promise<Chat[]> {
    console.log(333);

    return window.prisma.chat.findMany();
  }
}
