import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { 
  Edit, 
  Camera, 
  MapPin, 
  Calendar,
  Star,
  Award,
  Target,
  Users,
  Trophy,
  Activity
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { useDemo } from '../../contexts/DemoContext'

const activityCategories = [
  '🏔️ Hiking', '🎵 Music', '📚 Study Groups', '🎮 Gaming', '⚽ Sports', 
  '🎨 Art', '🍳 Cooking', '💻 Programming', '📷 Photography', '🧘 Yoga',
  '🏃 Running', '🚴 Cycling', '🎭 Theater', '🌱 Gardening', '📖 Book Clubs'
]

const skillLevels = [
  { name: 'Photography', level: 85, category: 'Creative' },
  { name: 'Hiking', level: 90, category: 'Outdoor' },
  { name: 'JavaScript', level: 75, category: 'Technical' },
  { name: 'Guitar', level: 60, category: 'Music' },
  { name: 'Rock Climbing', level: 70, category: 'Outdoor' }
]

const recentActivities = [
  {
    title: 'Weekend Photography Walk',
    group: 'SF Photography Club',
    date: '2 days ago',
    type: 'Photography',
    rating: 5
  },
  {
    title: 'Mount Tam Hiking Trail',
    group: 'Bay Area Hikers',
    date: '1 week ago',
    type: 'Hiking',
    rating: 5
  },
  {
    title: 'JavaScript Study Session',
    group: 'Tech Learning Group',
    date: '2 weeks ago',
    type: 'Learning',
    rating: 4
  }
]

export function Profile() {
  const { isDemo, demoUser } = useDemo()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: isDemo ? demoUser.name : "Alex Johnson",
    location: isDemo ? demoUser.location : "San Francisco, CA",
    bio: isDemo ? demoUser.bio : "Adventure enthusiast and tech professional looking to connect with like-minded people for outdoor activities and learning experiences.",
    interests: isDemo ? demoUser.interests : ['🏔️ Hiking', '📷 Photography', '💻 Programming', '🎵 Music'],
    skills: isDemo ? demoUser.skills : ['Photography', 'Hiking', 'JavaScript', 'Guitar'],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop"
    ]
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Profile saved:', profile)
  }

  const stats = [
    { label: 'Activities Completed', value: isDemo ? demoUser.completedActivities : 32, icon: Activity },
    { label: 'Groups Joined', value: isDemo ? demoUser.joinedGroups : 8, icon: Users },
    { label: 'Average Rating', value: `${isDemo ? demoUser.rating : 4.9}⭐`, icon: Star },
    { label: 'Member Since', value: 'Mar 2024', icon: Calendar }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={isDemo ? demoUser.avatar : profile.photos[0]} alt={profile.name} />
                  <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{profile.name}</h1>
                      {isDemo && (
                        <Badge variant="secondary">Demo User</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {isDemo ? demoUser.rating : '4.9'} Rating
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Tell others about your interests and what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    placeholder="Write something about yourself..."
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Interests</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? "Select activities you're interested in participating"
                    : "What I'm passionate about"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {activityCategories.map((interest) => (
                        <Badge
                          key={interest}
                          variant={profile.interests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80 transition-colors"
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selected: {profile.interests.length} interests
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  Showcase your skills and learn from others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillLevels.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: Trophy, title: 'Top Contributor', description: 'Most helpful in groups' },
                    { icon: Award, title: 'Activity Leader', description: 'Led 10+ activities' },
                    { icon: Target, title: 'Goal Achiever', description: 'Completed 50 activities' }
                  ].map((achievement, index) => (
                    <div key={index} className="text-center p-4 border border-border rounded-lg">
                      <achievement.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Activities you've participated in recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.group} • {activity.date}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < activity.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Photos</CardTitle>
                <CardDescription>
                  Share photos from your activities and adventures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <ImageWithFallback
                        src={photo}
                        alt={`Activity photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Add Photo</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}