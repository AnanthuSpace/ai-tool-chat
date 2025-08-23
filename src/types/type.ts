export type MessageRole = "user" | "assistant" | "tool";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | Record<string, unknown>; 
  created_at: string;
}
