'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Apple, Info, LogIn } from 'lucide-react'
import { GoogleIcon, GithubIcon } from '@/components/brand-icons'
import { useAuth } from '@/features/auth/contexts/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
  onNavigate?: (path: string) => void
}

export function LoginForm({ onSuccess, onNavigate }: LoginFormProps) {
  const router = useRouter()
  const { login, loginDemo, loginWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const go = () => {
    router.push('/feed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) go()
    else setError('Invalid email or password')
  }

  const handleDemoLogin = async () => {
    setError('')
    setLoading(true)
    const ok = await loginDemo()
    setLoading(false)
    if (ok) go()
    else setError('Demo login failed')
  }

  const handleSocialLogin = async (provider: string) => {
    setLoading(true)
    if (provider === 'google') {
      const ok = await loginWithGoogle()
      setLoading(false)
      if (ok) go()
      return
    }
    // github / apple not configured -> demo fallback
    const ok = await loginDemo()
    setLoading(false)
    if (ok) go()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Try the demo!</strong> Use email: <code>demo@test.com</code> and password:{' '}
          <code>demo</code>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleDemoLogin}
            className="ml-2 p-0 h-auto"
            disabled={loading}
          >
            Quick Demo Login
          </Button>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to GroupFinder</CardTitle>
          <CardDescription>Access your activity groups and find new adventures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('github')} disabled={loading}>
              <GithubIcon className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('apple')} disabled={loading}>
              <Apple className="mr-2 h-4 w-4" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Button variant="link" size="sm" onClick={() => onNavigate?.('/signup')} className="p-0 h-auto">
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
