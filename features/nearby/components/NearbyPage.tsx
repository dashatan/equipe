'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export function NearbyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="h-6 w-6" />
        <h1 className="text-2xl">Nearby</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activities Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Find activities and groups in your local area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}