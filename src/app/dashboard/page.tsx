"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, MessageSquare, LogOut } from "lucide-react";

type Role = "user" | "assistant";

interface DBMessage {
  id: string;
  chat_id: string;
  user_id: string;
  role: Role;
  content: string;
  created_at: string;
}

interface DBChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface Chat extends DBChat {
  messages: DBMessage[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [chats, activeChatId]
  );

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/signin");
        return;
      }
      setSession(data.session);
      setLoading(false);
    })();
  }, [router]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const load = async () => {
      const { data: chatRows } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const chatIds = (chatRows ?? []).map((c) => c.id);
      const messagesByChat: Record<string, DBMessage[]> = {};

      if (chatIds.length > 0) {
        const { data: messageRows } = await supabase
          .from("messages")
          .select("*")
          .in("chat_id", chatIds)
          .order("created_at", { ascending: true });

        for (const m of messageRows ?? []) {
          if (!messagesByChat[m.chat_id]) messagesByChat[m.chat_id] = [];
          messagesByChat[m.chat_id].push(m);
        }
      }

      const merged: Chat[] = (chatRows ?? []).map((c) => ({
        ...c,
        messages: messagesByChat[c.id] ?? [],
      }));
      setChats(merged);

      if (!activeChatId && merged.length > 0) setActiveChatId(merged[0].id);
    };

    load();
  }, [session?.user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length]);

  const createNewChat = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from("chats")
      .insert([{ user_id: session.user.id, title: "New Chat" }])
      .select("*")
      .single();

    const chat: Chat = { ...data, messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  const send = async () => {
    if (!input.trim() || !activeChat || !session?.user?.id) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimistic: DBMessage = {
      id: tempId,
      chat_id: activeChat.id,
      user_id: session.user.id,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, optimistic] }
          : c
      )
    );

    const { data } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: activeChat.id,
          user_id: session.user.id,
          role: "user",
          content,
        },
      ])
      .select("*")
      .single();

    if (data) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === tempId ? data : m)),
              }
            : c
        )
      );
    }

    const aiResponse = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });

    const aiData = await aiResponse.json();
    if (!aiResponse.ok) throw new Error(aiData.error || "AI API failed");
    const aiContent = aiData.text;

    const { data: aiMessage } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: activeChat.id,
          user_id: session.user.id,
          role: "assistant",
          content: aiContent,
        },
      ])
      .select("*")
      .single();

    if (aiMessage) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    }

    setSending(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border bg-card flex flex-col justify-between">
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-sm font-medium truncate mb-3">
            {session?.user?.email}
          </h2>

          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-2 bg-transparent mb-4"
            variant="outline"
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>

          <div className="flex flex-col gap-2">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant={chat.id === activeChatId ? "default" : "ghost"}
                className="justify-start truncate"
                onClick={() => setActiveChatId(chat.id)}
              >
                {chat.messages[0]?.content
                  ? chat.messages[0].content.slice(0, 30) + "..."
                  : chat.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            className="w-full flex items-center justify-center gap-2 text-red-500"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <Card className="h-full shadow-none">
            {activeChat ? (
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {activeChat.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{m.content}</p>
                        <p className="text-[10px] opacity-70 mt-1">
                          {new Date(m.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {sending && <div className="animate-pulse">Thinking...</div>}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Start a new conversation
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="p-6 pt-0 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeChat
                ? "Type your message..."
                : "Create a new chat to start messaging"
            }
            className="flex-1"
            disabled={!activeChat || sending}
          />
          <Button
            onClick={send}
            disabled={!input.trim() || !activeChat || sending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
