'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { Eye, EyeOff, Mail, Lock, Apple, Info } from 'lucide-react'
import { GoogleIcon, GithubIcon } from '@/components/brand-icons'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { useDemo } from '../../contexts/DemoContext'

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useDemo()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (login(email, password)) {
      router.push('/')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleDemoLogin = () => {
    setEmail('demo@test.com')
    setPassword('demo')
    if (login('demo@test.com', 'demo')) {
      router.push('/')
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Simulate successful social login
    if (login('social@example.com', 'social-login')) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=1200&fit=crop" 
          alt="People doing activities together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg opacity-90">
            Continue connecting with your activity groups and discover new adventures
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}