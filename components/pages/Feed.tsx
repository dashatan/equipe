import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Clock,
  Users
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

const mockPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      location: "Golden Gate Park"
    },
    content: "Beautiful sunset hike today! The views from the top were absolutely breathtaking. Who wants to join me next weekend?",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    likes: 24,
    comments: 8,
    time: "2 hours ago",
    interests: ['🏔️ Mountains', '📷 Photography']
  },
  {
    id: 2,
    user: {
      name: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      location: "Downtown Coffee Shop"
    },
    content: "Found this amazing coffee shop that serves the best cappuccino in the city! Perfect spot for working remotely.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    likes: 15,
    comments: 3,
    time: "4 hours ago",
    interests: ['☕ Coffee', '📱 Technology']
  },
  {
    id: 3,
    user: {
      name: "Photography Group",
      avatar: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop",
      location: "Mission District"
    },
    content: "Street photography meetup was incredible! So many talented photographers sharing their techniques.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
    likes: 42,
    comments: 12,
    time: "6 hours ago",
    interests: ['📷 Photography', '🎨 Art'],
    isGroup: true,
    members: 156
  }
]

const suggestedConnections = [
  {
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    mutualInterests: 5,
    location: "2 miles away"
  },
  {
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    mutualInterests: 3,
    location: "1.5 miles away"
  }
]

export function Feed() {
  const [activeTab, setActiveTab] = useState("feed")
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Suggested Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <h3 className="font-semibold">People You Might Like</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedConnections.map((connection, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                          <AvatarFallback>{connection.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground space-x-2">
                            <span>{connection.mutualInterests} mutual interests</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {connection.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Posts */}
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.user.avatar} alt={post.user.name} />
                          <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {post.isGroup && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            <Users className="h-2 w-2" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{post.user.name}</p>
                          {post.isGroup && (
                            <Badge variant="secondary" className="text-xs">
                              {post.members} members
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{post.content}</p>
                  
                  {post.image && (
                    <div className="rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={likedPosts.includes(post.id) ? "text-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                        {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Start following people to see their posts here
            </p>
            <Button>Discover People</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}