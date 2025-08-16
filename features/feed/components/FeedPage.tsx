'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home } from 'lucide-react'

export function FeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Home className="h-6 w-6" />
        <h1 className="text-2xl">Feed</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your personalized activity feed will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}