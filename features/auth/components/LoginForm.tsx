'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Apple, Info } from 'lucide-react'
import { GoogleIcon, GithubIcon } from '@/components/brand-icons'
import { useDemo } from '@/contexts/DemoContext'

interface LoginFormProps {
  onSuccess?: () => void
  onNavigate?: (path: string) => void
}

export function LoginForm({ onSuccess, onNavigate }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useDemo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (login(email, password)) {
      onSuccess?.()
    } else {
      setError('Invalid email or password')
    }
  }

  const handleDemoLogin = () => {
    setEmail('demo@test.com')
    setPassword('demo')
    if (login('demo@test.com', 'demo')) {
      onSuccess?.()
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Simulate successful social login
    if (login('social@example.com', 'social-login')) {
      onSuccess?.()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md space-y-6"
    >
      {/* Demo Account Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Try the demo!</strong> Use email: <code>demo@test.com</code> and password: <code>demo</code>
          <Button
            variant="link"
            size="sm"
            onClick={handleDemoLogin}
            className="ml-2 p-0 h-auto"
          >
            Quick Demo Login
          </Button>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to GroupFinder</CardTitle>
          <CardDescription>
            Access your activity groups and find new adventures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleSocialLogin('google')}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleSocialLogin('github')}
            >
              <GithubIcon className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleSocialLogin('apple')}
            >
              <Apple className="mr-2 h-4 w-4" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
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
                  type={showPassword ? "text" : "password"}
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

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => onNavigate?.('/forgot-password')}
                className="p-0 h-auto"
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigate?.('/signup')}
              className="p-0 h-auto"
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 