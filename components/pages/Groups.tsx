import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Plus, 
  Users, 
  MapPin, 
  Calendar,
  Search,
  Settings,
  Crown,
  MessageCircle
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

const myGroups = [
  {
    id: 1,
    name: "SF Photography Club",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop",
    members: 156,
    role: "Admin",
    lastActivity: "2 hours ago",
    unreadMessages: 5,
    category: "Photography"
  },
  {
    id: 2,
    name: "Weekend Hikers",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    members: 89,
    role: "Member",
    lastActivity: "Yesterday",
    unreadMessages: 0,
    category: "Outdoors"
  },
  {
    id: 3,
    name: "Coffee Lovers United",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
    members: 234,
    role: "Moderator",
    lastActivity: "3 days ago",
    unreadMessages: 2,
    category: "Food & Drink"
  }
]

const discoverGroups = [
  {
    id: 4,
    name: "Tech Entrepreneurs",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=200&fit=crop",
    members: 567,
    category: "Business",
    description: "Networking and collaboration for tech startup founders",
    distance: "2.1 miles away"
  },
  {
    id: 5,
    name: "Book Club Society",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    members: 123,
    category: "Literature",
    description: "Monthly discussions of contemporary and classic literature",
    distance: "1.5 miles away"
  },
  {
    id: 6,
    name: "Urban Gardeners",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
    members: 89,
    category: "Lifestyle",
    description: "Growing green spaces in the city together",
    distance: "3.2 miles away"
  }
]

export function Groups() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('my-groups')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public'
  })

  const handleCreateGroup = () => {
    console.log('Creating group:', newGroup)
    setIsCreateDialogOpen(false)
    setNewGroup({ name: '', description: '', category: '', privacy: 'public' })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Connect with communities that share your interests
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Start a community around your interests
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name..."
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  placeholder="What's this group about?"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="group-category">Category</Label>
                <Select value={newGroup.category} onValueChange={(value) => setNewGroup(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="outdoors">Outdoors</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-privacy">Privacy</Label>
                <Select value={newGroup.privacy} onValueChange={(value) => setNewGroup(prev => ({ ...prev, privacy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group, index) => (
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
                      {group.role === 'Admin' && (
                        <Badge variant="destructive" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {group.role === 'Moderator' && (
                        <Badge variant="secondary" className="text-xs">
                          Moderator
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.unreadMessages > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                          {group.unreadMessages}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        {group.members} members
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-2" />
                        Last activity: {group.lastActivity}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        View Group
                      </Button>
                      {group.role === 'Admin' && (
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverGroups.map((group, index) => (
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
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        {group.members} members
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        {group.distance}
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Group
                    </Button>
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