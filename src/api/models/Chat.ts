export type Message = {
  content: string;
  id: string;
  role: Role;
};

export type Role = "assistant" | "system" | "user";
export type Chat = {
  avatar?: string;
  emoji?: string;
  id: string;
  title: string;
};
