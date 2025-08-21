"use server";

import { supabaseServer } from "@/lib/supabase/supabaseServer";

export async function requireUser() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return data.user;
}

export async function listChats() {
  const user = await requireUser();
  if (!user) return { chats: [] };
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("chats")
    .select("id,title,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return { chats: data ?? [] };
}

export async function listMessages(chatId: string) {
  const user = await requireUser();
  if (!user) return { messages: [] };
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("messages")
    .select("id,role,content,created_at")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  return { messages: data ?? [] };
}

export async function createChat(title: string) {
  const user = await requireUser();
  if (!user) throw new Error("unauthorized");
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: user.id, title })
    .select("id,title,created_at")
    .single();
  if (error) throw error;
  return data;
}

export async function saveMessage(chatId: string, role: "user"|"assistant"|"tool", content: any) {
  const user = await requireUser();
  if (!user) throw new Error("unauthorized");
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, user_id: user.id, role, content })
    .select("id,role,content,created_at")
    .single();
  if (error) throw error;
  return data;
}
