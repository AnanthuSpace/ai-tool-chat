import { supabase } from "../supabase/supabaseClient";
import { Chat, Message } from "../types/chat";

export async function createChat(userId: string, title: string): Promise<Chat | null> {
  const { data, error } = await supabase
    .from("chats")
    .insert([{ user_id: userId, title }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addMessage(
  chatId: string,
  userId: string | null,
  role: "user" | "assistant" | "system",
  content: string
): Promise<Message | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, user_id: userId, role, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
