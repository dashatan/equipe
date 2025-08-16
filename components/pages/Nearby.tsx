import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Slider } from '../ui/slider'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Filter,
  Navigation
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

const nearbyPeople = [
  {
    id: 1,
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    distance: "0.5 miles away",
    interests: ['☕ Coffee', '📚 Reading', '🎵 Music'],
    lastSeen: "Active now",
    mutualFriends: 3
  },
  {
    id: 2,
    name: "Ryan Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    distance: "1.2 miles away",
    interests: ['🏃 Fitness', '🍳 Cooking', '📱 Technology'],
    lastSeen: "2 hours ago",
    mutualFriends: 1
  },
  {
    id: 3,
    name: "Sofia Martinez",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    distance: "2.1 miles away",
    interests: ['🎨 Art', '✈️ Travel', '📷 Photography'],
    lastSeen: "1 hour ago",
    mutualFriends: 5
  }
]

const nearbyEvents = [
  {
    id: 1,
    title: "Photography Walk in Mission District",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop",
    date: "Tomorrow",
    time: "10:00 AM",
    location: "Mission Dolores Park",
    distance: "0.8 miles away",
    attendees: 12,
    maxAttendees: 20,
    category: "Photography"
  },
  {
    id: 2,
    title: "Coffee & Code Meetup",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop",
    date: "This Friday",
    time: "6:00 PM",
    location: "Blue Bottle Coffee",
    distance: "1.5 miles away",
    attendees: 8,
    maxAttendees: 15,
    category: "Technology"
  },
  {
    id: 3,
    title: "Sunset Hike Group",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    date: "Saturday",
    time: "5:00 PM",
    location: "Twin Peaks",
    distance: "3.2 miles away",
    attendees: 15,
    maxAttendees: 25,
    category: "Outdoors"
  }
]

export function Nearby() {
  const [searchRadius, setSearchRadius] = useState([5])
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Nearby</h1>
          <p className="text-muted-foreground">
            Discover people and events around you
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Update Location
          </Button>
        </div>
      </motion.div>

      {/* Search radius filter */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Search Radius: {searchRadius[0]} miles
                  </label>
                  <Slider
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                    max={20}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Nearby People */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                People Nearby
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{person.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{person.distance}</span>
                        <span>•</span>
                        <span>{person.mutualFriends} mutual</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.interests.slice(0, 2).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" className="mb-2">
                      Connect
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {person.lastSeen}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                See More People
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nearby Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Events Nearby
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        {event.location} • {event.distance}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Event
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                See More Events
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}