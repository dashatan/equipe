'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

interface ConversationT {
  userId: string; name: string; avatar: string; location: string
  lastMessage: string; lastMessageAt: string; unread: number
}
interface MessageT {
  id: string; content: string; createdAt: string; senderId: string; recipientId: string | null; isRead: boolean
}

export function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationT[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageT[]>([])
  const [draft, setDraft] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {
      toast.error('Failed to load conversations')
    } finally {
      setLoadingConvos(false)
    }
  }, [])

  useEffect(() => { loadConversations() }, [loadConversations])

  const loadThread = useCallback(async (userId: string) => {
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/messages?with=${userId}`)
      const data = await res.json()
      setMessages(data.messages ?? [])
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoadingThread(false)
    }
  }, [])

  useEffect(() => {
    if (activeId) loadThread(activeId)
  }, [activeId, loadThread])

  // poll for new messages in active thread
  useEffect(() => {
    if (!activeId) return
    const interval = setInterval(() => loadThread(activeId), 5000)
    return () => clearInterval(interval)
  }, [activeId, loadThread])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async () => {
    if (!draft.trim() || !activeId) return
    const content = draft.trim()
    setDraft('')
    setSending(true)
    const optimistic: MessageT = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      senderId: user?.id ?? '',
      recipientId: activeId,
      isRead: false,
    }
    setMessages((m) => [...m, optimistic])
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: activeId, content }),
      })
      if (!res.ok) throw new Error()
      await loadConversations()
    } catch {
      toast.error('Failed to send')
      setMessages((m) => m.filter((msg) => msg.id !== optimistic.id))
      setDraft(content)
    } finally {
      setSending(false)
    }
  }

  const activeConvo = conversations.find((c) => c.userId === activeId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground">Chat with other members</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[280px_1fr] h-[600px]">
          {/* Conversation list */}
          <div className={`border-r ${activeId ? 'hidden md:block' : ''}`}>
            <ScrollArea className="h-full">
              {loadingConvos ? (
                <div className="p-3 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground space-y-2">
                  <div className="text-3xl">💬</div>
                  No conversations yet.
                  <div className="text-xs">Join a group and message members to start chatting.</div>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.userId}
                    onClick={() => setActiveId(c.userId)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left border-b ${
                      activeId === c.userId ? 'bg-accent' : ''
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{c.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{c.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: false })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground truncate">{c.lastMessage}</span>
                        {c.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 shrink-0">{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Thread */}
          <div className={`flex flex-col ${activeId ? '' : 'hidden md:flex'}`}>
            {activeId ? (
              <>
                <div className="flex items-center gap-3 p-3 border-b">
                  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setActiveId(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activeConvo?.avatar} alt={activeConvo?.name} />
                    <AvatarFallback>{activeConvo?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{activeConvo?.name}</div>
                    {activeConvo?.location && (
                      <div className="text-xs text-muted-foreground">{activeConvo.location}</div>
                    )}
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                  {loadingThread ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-2/3 rounded-lg" />)}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      No messages yet. Say hello! 👋
                    </div>
                  ) : (
                    messages.map((m) => {
                      const mine = m.senderId === user?.id
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              mine
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-card border rounded-bl-sm'
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                            <div className={`text-xs mt-1 ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {format(new Date(m.createdAt), 'h:mm a')}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>

                <div className="p-3 border-t flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    disabled={sending}
                  />
                  <Button onClick={sendMessage} disabled={!draft.trim() || sending} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <div className="text-4xl">💬</div>
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
