'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass } from 'lucide-react'

export function ExplorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-6 w-6" />
        <h1 className="text-2xl">Explore</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Discover New Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Explore new groups and activities in your area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}