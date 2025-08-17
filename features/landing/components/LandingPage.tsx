'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Target,
  ArrowRight,
  Play
} from 'lucide-react'
import Image from 'next/image'
import t, { locale } from '@/lang'


type AuthView = 'landing' | 'login' | 'signup'

export function LandingPage() {
  const [currentView, setCurrentView] = useState<AuthView>('landing')
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  if (currentView === 'login') {
    return <LoginForm onSuccess={() => setCurrentView('landing')} onNavigate={() => setCurrentView('signup')} />
  }

  if (currentView === 'signup') {
    return <SignupForm onSuccess={() => setCurrentView('landing')} onNavigate={() => setCurrentView('login')} />
  }

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
        <Image 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop" 
          alt="People doing activities together" 
          fill
          className="object-cover opacity-20"
          priority
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
              {t.landing.title}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t.landing.subtitle}
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
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setCurrentView('signup')}
              >
                {t.landing.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setCurrentView('login')}
              >
                <Play className="mr-2 h-4 w-4" />
                {t.landing.tryDemo}
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
                {t.landing.popularCategories}
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
                    <Image 
                      src={activity.image} 
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
    </div>
  )
}