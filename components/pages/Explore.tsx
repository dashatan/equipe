import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Heart,
  Star,
  TrendingUp
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

const trendingTopics = [
  { name: 'Photography Walks', posts: 1234, trending: true },
  { name: 'Coffee Meetups', posts: 856, trending: true },
  { name: 'Hiking Groups', posts: 2341, trending: false },
  { name: 'Art Galleries', posts: 567, trending: true },
  { name: 'Book Clubs', posts: 432, trending: false }
]

const featuredProfiles = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    location: "San Francisco, CA",
    interests: ['📷 Photography', '🏔️ Mountains', '☕ Coffee'],
    followers: 1234,
    isVerified: true
  },
  {
    id: 2,
    name: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    location: "Los Angeles, CA",
    interests: ['🎨 Art', '🍳 Cooking', '✈️ Travel'],
    followers: 856,
    isVerified: false
  },
  {
    id: 3,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    location: "Seattle, WA",
    interests: ['🎵 Music', '🎮 Gaming', '📱 Technology'],
    followers: 2341,
    isVerified: true
  }
]

const popularGroups = [
  {
    id: 1,
    name: "SF Photography Enthusiasts",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop",
    members: 1547,
    category: "Photography",
    description: "Weekly photo walks and workshops for all skill levels"
  },
  {
    id: 2,
    name: "Bay Area Hikers",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    members: 2834,
    category: "Outdoors",
    description: "Exploring the best trails in Northern California"
  },
  {
    id: 3,
    name: "Tech Coffee Chats",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
    members: 987,
    category: "Technology",
    description: "Casual meetups to discuss tech over great coffee"
  }
]

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('trending')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people, groups, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-muted-foreground">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{topic.name}</p>
                            {topic.trending && (
                              <Badge variant="destructive" className="text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {topic.posts.toLocaleString()} posts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Profiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Featured Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredProfiles.map((profile) => (
                    <div key={profile.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <p className="font-medium">{profile.name}</p>
                            {profile.isVerified && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {profile.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {profile.interests.slice(0, 2).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {profile.interests.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {profile.followers.toLocaleString()} followers
                        </p>
                        <Button size="sm">Connect</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.concat(featuredProfiles).map((profile, index) => (
              <motion.div
                key={`${profile.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <h3 className="font-semibold">{profile.name}</h3>
                        {profile.isVerified && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center justify-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profile.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {profile.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {profile.followers.toLocaleString()} followers
                      </p>
                      
                      <Button className="w-full">Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{group.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {group.members.toLocaleString()} members
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTopics.concat([
              { name: 'Fitness Challenges', posts: 1876, trending: false },
              { name: 'Food & Cooking', posts: 3421, trending: true },
              { name: 'Movie Nights', posts: 654, trending: false }
            ]).map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{topic.name}</h3>
                      {topic.trending && (
                        <Badge variant="destructive" className="text-xs">
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {topic.posts.toLocaleString()} posts
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}