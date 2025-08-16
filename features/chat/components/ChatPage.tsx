'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'

export function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6" />
        <h1 className="text-2xl">Messages</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chat with other members and group discussions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}