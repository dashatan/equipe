'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { MessageSquare, ArrowLeft } from 'lucide-react'

interface MessageT {
  id: string; content: string; createdAt: string; isRead: boolean; type: string
  sender: { id: string; name: string; avatar: string }
  recipient: { id: string; name: string; avatar: string } | null
}

export function AdminMessages() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<MessageT[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages?limit=50')
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      const data = await res.json()
      setMessages(data.messages ?? [])
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    load()
  }, [isAuthenticated, isLoading, load])

  const fmt = (d: string) => new Date(d).toLocaleString()

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Messages ({messages.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground"><div className="text-4xl mb-2">💬</div>No messages yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead><TableHead>Recipient</TableHead><TableHead>Message</TableHead>
                      <TableHead>Status</TableHead><TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarImage src={m.sender.avatar} alt={m.sender.name} /><AvatarFallback>{m.sender.name?.[0]}</AvatarFallback></Avatar>
                            <span className="text-sm">{m.sender.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {m.recipient ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7"><AvatarImage src={m.recipient.avatar} alt={m.recipient.name} /><AvatarFallback>{m.recipient.name?.[0]}</AvatarFallback></Avatar>
                              <span className="text-sm">{m.recipient.name}</span>
                            </div>
                          ) : <span className="text-muted-foreground text-sm">—</span>}
                        </TableCell>
                        <TableCell className="max-w-xs"><div className="text-sm truncate">{m.content}</div></TableCell>
                        <TableCell><Badge variant={m.isRead ? 'default' : 'secondary'} className="text-xs">{m.isRead ? 'Read' : 'Unread'}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmt(m.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
