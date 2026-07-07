'use client'

import React, { createContext, useContext, useState } from 'react'

interface DemoUser {
  id: string
  name: string
  email: string
  avatar: string
  location: string
  bio: string
  skills: string[]
  interests: string[]
  completedActivities: number
  rating: number
  joinedGroups: number
}

interface DemoContextType {
  isDemo: boolean
  setIsDemo: (demo: boolean) => void
  demoUser: DemoUser
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const demoUser: DemoUser = {
  id: 'demo-user-1',
  name: 'Alex Thompson',
  email: 'alex.demo@groupfinder.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  location: 'San Francisco, CA',
  bio: 'Adventure enthusiast and tech professional looking to connect with like-minded people for outdoor activities and learning experiences. Always excited to try new things!',
  skills: ['Photography', 'Hiking', 'JavaScript', 'Guitar', 'Rock Climbing'],
  interests: ['🏔️ Hiking', '📷 Photography', '🎸 Music', '💻 Programming', '📚 Book Clubs', '🧗 Rock Climbing'],
  completedActivities: 47,
  rating: 4.8,
  joinedGroups: 12
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (email: string, password: string): boolean => {
    // Demo login - accept demo credentials or any other credentials
    if (email === 'demo@test.com' && password === 'demo') {
      setIsDemo(true)
      setIsAuthenticated(true)
      return true
    } else if (email && password) {
      setIsDemo(false)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsDemo(false)
  }

  return (
    <DemoContext.Provider value={{
      isDemo,
      setIsDemo,
      demoUser,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}