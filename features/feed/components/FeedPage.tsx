'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Send, ImagePlus, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '@/features/auth/contexts/AuthContext'

interface CommentT {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string; avatar: string }
}
interface PostT {
  id: string
  content: string
  images: string[]
  type: string
  tags: string[]
  createdAt: string
  author: { id: string; name: string; avatar: string; location: string }
  group?: { id: string; name: string } | null
  activity?: { id: string; title: string } | null
  comments: CommentT[]
  likes: { userId: string }[]
}

export function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostT[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [commentingId, setCommentingId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts?limit=30')
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const submitPost = async () => {
    if (!newPost.trim()) return
    setComposing(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.trim(), type: 'general', tags: [] }),
      })
      if (!res.ok) throw new Error()
      const post: PostT = await res.json()
      setPosts((p) => [post, ...p])
      setNewPost('')
      toast.success('Post shared!')
    } catch {
      toast.error('Failed to post')
    } finally {
      setComposing(false)
    }
  }

  const toggleLike = async (post: PostT) => {
    const liked = post.likes.some((l) => l.userId === user?.id)
    // optimistic
    setPosts((ps) =>
      ps.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((l) => l.userId !== user?.id)
                : [...p.likes, { userId: user?.id ?? '' }],
            }
          : p
      )
    )
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: liked ? 'DELETE' : 'POST' })
      if (!res.ok) throw new Error()
    } catch {
      // revert
      setPosts((ps) =>
        ps.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likes: liked
                  ? [...p.likes, { userId: user?.id ?? '' }]
                  : p.likes.filter((l) => l.userId !== user?.id),
              }
            : p
        )
      )
      toast.error('Failed to toggle like')
    }
  }

  const submitComment = async (post: PostT) => {
    if (!commentText.trim()) return
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() }),
      })
      if (!res.ok) throw new Error()
      const comment: CommentT = await res.json()
      setPosts((ps) =>
        ps.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, comment] } : p))
      )
      setCommentText('')
      setCommentingId(null)
      toast.success('Comment added')
    } catch {
      toast.error('Failed to add comment')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="text-sm text-muted-foreground">See what your community is up to</p>
        </div>
      </div>

      {/* Compose */}
      <Card className="border-primary/20 bg-card/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share something with the community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="resize-none bg-background/60"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => toast.info('Image uploads coming soon')}>
                  <ImagePlus className="h-4 w-4 mr-2" /> Photo
                </Button>
                <Button onClick={submitPost} disabled={composing || !newPost.trim()}>
                  {composing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <div className="text-5xl">📭</div>
            <h3 className="text-lg font-semibold">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          {posts.map((post) => {
            const liked = post.likes.some((l) => l.userId === user?.id)
            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          {post.group && <span> · in {post.group.name}</span>}
                        </div>
                      </div>
                      {post.activity && (
                        <Badge variant="secondary" className="text-xs">
                          {post.activity.title}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={liked ? 'text-red-500 hover:text-red-500' : ''}
                        onClick={() => toggleLike(post)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                        {post.likes.length}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCommentingId(commentingId === post.id ? null : post.id)
                        }
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments.length}
                      </Button>
                    </div>

                    {commentingId === post.id && (
                      <div className="space-y-3 pt-2">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="resize-none bg-background/60"
                            rows={2}
                          />
                          <Button
                            size="sm"
                            onClick={() => submitComment(post)}
                            disabled={!commentText.trim()}
                            className="self-end"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {post.comments.map((c) => (
                            <div key={c.id} className="flex gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={c.author.avatar} alt={c.author.name} />
                                <AvatarFallback>{c.author.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
                                <div className="text-sm font-medium">{c.author.name}</div>
                                <div className="text-sm">{c.content}</div>
                              </div>
                            </div>
                          ))}
                          {post.comments.length === 0 && (
                            <p className="text-xs text-muted-foreground">No comments yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </div>
  )
}
