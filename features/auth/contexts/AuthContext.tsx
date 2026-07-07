'use client'

import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'

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
  const { data: session, status } = useSession()
  const router = useRouter()

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        avatar: session.user.image ?? undefined,
        location: (session.user as any).location ?? undefined,
        provider: (session.user as any).isDemo ? 'demo' : 'email',
        isDemo: (session.user as any).isDemo,
      }
    : null

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      return res?.ok ?? false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!response.ok) return false
      const res = await signIn('credentials', { email, password, redirect: false })
      return res?.ok ?? false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const loginDemo = async (): Promise<boolean> => {
    try {
      const res = await signIn('credentials', {
        email: 'demo@test.com',
        password: 'demo',
        redirect: false,
      })
      return res?.ok ?? false
    } catch (error) {
      console.error('Demo login failed:', error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    // No OAuth client configured — fall back to demo session to preserve UX.
    return loginDemo()
  }

  const logout = () => {
    signOut({ redirect: false }).then(() => router.push('/landing'))
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: status === 'loading',
        login,
        register,
        logout,
        loginWithGoogle,
        loginDemo,
      }}
    >
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
