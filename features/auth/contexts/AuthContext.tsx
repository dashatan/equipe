'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  location?: string
  provider: string
  isDemo?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loginWithGoogle: () => Promise<boolean>
  loginDemo: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = getCookie('auth-token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token with server
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Invalid token, remove it
        removeCookie('auth-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      removeCookie('auth-token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setCookie('auth-token', data.token, 7) // 7 days
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setCookie('auth-token', data.token, 7) // 7 days
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Mock Google login for demo
      const demoUser: User = {
        id: 'google-demo-user',
        name: 'Google Demo User',
        email: 'google@demo.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        location: 'Mountain View, CA',
        provider: 'google',
        isDemo: true
      }

      setUser(demoUser)
      
      // Create demo token
      const demoToken = btoa(JSON.stringify({ userId: demoUser.id, isDemo: true }))
      setCookie('auth-token', demoToken, 7)
      
      return true
    } catch (error) {
      console.error('Google login failed:', error)
      return false
    }
  }

  const loginDemo = async (): Promise<boolean> => {
    try {
      const demoUser: User = {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@test.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
        location: 'Demo City, DC',
        provider: 'demo',
        isDemo: true
      }

      setUser(demoUser)
      
      // Create demo token
      const demoToken = btoa(JSON.stringify({ userId: demoUser.id, isDemo: true }))
      setCookie('auth-token', demoToken, 7)
      
      return true
    } catch (error) {
      console.error('Demo login failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    removeCookie('auth-token')
    router.push('/landing')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      loginWithGoogle,
      loginDemo
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Cookie utilities
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
}

function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function removeCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}