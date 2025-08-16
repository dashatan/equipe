import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Target,
  ArrowRight,
  Play
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export function Landing() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const activities = [
    {
      icon: '🏔️',
      title: "Hiking & Outdoor Adventures",
      description: "Join hiking groups, find climbing partners, and explore nature with fellow outdoor enthusiasts.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      memberCount: "2.3k"
    },
    {
      icon: '🎵',
      title: "Music & Creative Arts",
      description: "Form bands, practice together, join choirs, or collaborate on creative projects with artists.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      memberCount: "1.8k"
    },
    {
      icon: '📚',
      title: "Study Groups & Learning",
      description: "Find study partners, join book clubs, practice languages, or learn new skills together.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      memberCount: "3.1k"
    },
    {
      icon: '🎮',
      title: "Gaming & Sports",
      description: "Organize game nights, find teammates for sports, or compete in esports tournaments.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      memberCount: "4.2k"
    }
  ]

  const stats = [
    { number: "15,000+", label: "Active Members" },
    { number: "500+", label: "Weekly Activities" },
    { number: "50+", label: "Activity Categories" },
    { number: "98%", label: "Success Rate" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        style={{ y, opacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/30" />
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop" 
          alt="People doing activities together" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50"
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent-foreground bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Activity Crew
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with people who share your passions. From hiking adventures to study groups, 
              music practice to gaming sessions - find your perfect activity partners today.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-2 justify-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {['Hiking', 'Music', 'Study Groups', 'Gaming', 'Sports', 'Art', 'Cooking', 'Tech'].map((activity) => (
                <Badge key={activity} variant="secondary" className="px-3 py-1">
                  {activity}
                </Badge>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/signup">
                  Start Connecting <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">
                  <Play className="mr-2 h-4 w-4" />
                  Try Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Activities Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Activity Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover communities built around shared interests and activities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-3xl mb-2">{activity.icon}</div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {activity.memberCount} members
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Getting started is simple - find your tribe in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <Target className="h-8 w-8" />,
                title: "Choose Your Interests",
                description: "Select activities you're passionate about and skills you want to share or learn."
              },
              {
                step: "2",
                icon: <Users className="h-8 w-8" />,
                title: "Find Your Group",
                description: "Discover local groups and activities that match your interests and schedule."
              },
              {
                step: "3",
                icon: <Calendar className="h-8 w-8" />,
                title: "Join & Participate",
                description: "Connect with your group, plan activities, and start building lasting friendships."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6 mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
              ].map((avatar, index) => (
                <div key={index} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden">
                  <ImageWithFallback
                    src={avatar}
                    alt={`Member ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="ml-4 text-left">
              <p className="font-semibold">Join 15,000+ active members</p>
              <p className="text-sm text-muted-foreground">Finding their perfect activity partners</p>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Activity Crew?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already connecting through shared interests and activities. 
            Your next adventure is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">
                Get Started Free <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/login">
                Try Demo Account
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}