'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Calendar, Users, Search, Navigation, Crosshair } from 'lucide-react'

interface ActivityT {
  id: string; title: string; description: string; category: string; date: string
  location: string; lat: number | null; lng: number | null; cost: number
  maxParticipants: number; currentParticipants: number; difficulty: string
  group: { id: string; name: string }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function NearbyPage() {
  const [location, setLocation] = useState('')
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null)
  const [activities, setActivities] = useState<ActivityT[]>([])
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ status: 'upcoming' })
      if (location) q.set('location', location)
      const res = await fetch(`/api/activities?${q.toString()}`)
      const data = await res.json()
      setActivities(data.activities ?? [])
    } catch {
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
        toast.success('Using your location to sort by distance')
      },
      () => {
        setLocating(false)
        toast.error('Could not get your location')
      }
    )
  }

  const sorted = origin
    ? [...activities]
        .filter((a) => a.lat != null && a.lng != null)
        .map((a) => ({ ...a, _dist: haversine(origin.lat, origin.lng, a.lat!, a.lng!) }))
        .sort((a, b) => a._dist - b._dist)
    : activities

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Navigation className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Nearby</h1>
          <p className="text-sm text-muted-foreground">Activities happening close to you</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by city or place..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={useMyLocation} disabled={locating}>
          <Crosshair className="h-4 w-4 mr-2" /> {locating ? 'Locating...' : 'My Location'}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <div className="text-5xl">🧭</div>
            <h3 className="text-lg font-semibold">No nearby activities</h3>
            <p className="text-muted-foreground">Try a different location or broaden your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/groups/${a.group.id}`}>
                <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                  <CardContent className="flex items-start gap-4 py-4">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs font-medium mt-0.5">{format(new Date(a.date), 'MMM d')}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">{a.title}</h3>
                        <Badge variant="secondary" className="capitalize shrink-0">{a.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.currentParticipants}/{a.maxParticipants}</span>
                      </div>
                      {(a as any)._dist != null && (
                        <div className="text-xs text-primary font-medium">
                          {(a as any)._dist < 1 ? `${Math.round((a as any)._dist * 1000)} m away` : `${(a as any)._dist.toFixed(1)} km away`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
