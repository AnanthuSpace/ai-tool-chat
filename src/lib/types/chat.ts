export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string | null;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}
