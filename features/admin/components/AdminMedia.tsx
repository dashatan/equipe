'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { Images, ArrowLeft, Trash2 } from 'lucide-react'

interface ImageT {
  id: string; filename: string; originalName: string; mimetype: string; size: number
  url: string; isPublic: boolean; createdAt: string
  uploader: { id: string; name: string; avatar: string }
}

export function AdminMedia() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [images, setImages] = useState<ImageT[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media?limit=50')
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      const data = await res.json()
      setImages(data.images ?? [])
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    load()
  }, [isAuthenticated, isLoading, load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!res.ok) throw new Error()
      toast.success('Image deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`
  const fmtDate = (d: string) => new Date(d).toLocaleDateString()

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <Images className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Media Library</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Images ({images.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : images.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground"><div className="text-4xl mb-2">🖼️</div>No media uploaded yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <Card key={img.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.originalName} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <div className="text-sm font-medium truncate">{img.originalName}</div>
                      <div className="text-xs text-muted-foreground">{fmtSize(img.size)} · {fmtDate(img.createdAt)}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5"><AvatarImage src={img.uploader.avatar} alt={img.uploader.name} /><AvatarFallback>{img.uploader.name?.[0]}</AvatarFallback></Avatar>
                          <span className="text-xs text-muted-foreground">{img.uploader.name}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(img.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
