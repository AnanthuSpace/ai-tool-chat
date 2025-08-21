"use client"

import type React from "react"

import { withAuth } from "@/lib/withAuth"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Send, MessageSquare, Mic } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

function Dashboard({ session }: { session: any }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chats, activeChat])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    // Update chat with user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? input.trim().slice(0, 30) + "..." : chat.title,
            }
          : chat,
      ),
    )

    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${userMessage.content}". This is a simulated response. You can integrate with your preferred AI API here.`,
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat ? { ...chat, messages: [...chat.messages, assistantMessage] } : chat,
        ),
      )
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Welcome, {session?.user?.email}</h2>
          </div>
          <Button onClick={createNewChat} className="w-full justify-start gap-2 bg-transparent" variant="outline">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                  activeChat === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">

        <div className="flex-1 p-6">
          <Card className="h-full shadow-none">
            {activeChat && currentChat ? (
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {currentChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">Thinking...</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Start a new conversation</p>
                  <p className="text-sm">Click "New Chat" to begin</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Input Field */}
        <div className="p-6 pt-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={activeChat ? "Type your message..." : "Create a new chat to start messaging"}
              disabled={!activeChat || isLoading}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={!activeChat || isLoading}
              onClick={() => {
                console.log("[v0] Voice recording clicked")
              }}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={sendMessage} disabled={!input.trim() || !activeChat || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)
