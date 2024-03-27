export type Message = {
  content: string;
  id: string;
  role: Role;
  chatId: string;
  status?: string;
};

export type Role = "assistant" | "system" | "user";
export type Chat = {
  avatar?: string;
  emoji?: string;
  id: string;
  title: string;
  brand_id: string;
  total_tokens: number;
  type: "new" | "exist";
};
export type GeneralMessageSend = {
  role: string;
  content: string;
}[];
