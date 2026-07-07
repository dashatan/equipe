'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Mail, Lock, User, Apple } from 'lucide-react'
import { GoogleIcon, GithubIcon } from '@/components/brand-icons'

const interests = [
  '🎵 Music', '⚽ Sports', '🎨 Art', '📚 Reading', '🍳 Cooking', '✈️ Travel',
  '🎮 Gaming', '🏃 Fitness', '📱 Technology', '🎬 Movies', '📷 Photography', '🌱 Nature',
  '🧘 Meditation', '🍷 Wine', '☕ Coffee', '🏖️ Beach', '🏔️ Mountains', '🎭 Theater'
]

interface SignupFormProps {
  onSuccess?: () => void
  onNavigate?: (path: string) => void
}

export function SignupForm({ onSuccess, onNavigate }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [] as string[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      console.log('Signup attempt:', formData)
      onSuccess?.()
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Signup with ${provider}`)
    // Handle social signup logic here
    onSuccess?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {step === 1 ? 'Create Account' : 'Choose Your Interests'}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Enter your details to get started' 
              : 'Select topics you\'re interested in to find better matches'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              {/* Social Signup Buttons */}
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
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select at least 3 interests to help us find people you'll connect with:
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.interests.length} interests
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={formData.interests.length < 3}
                  className="flex-1"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm mt-6">
            Already have an account?{' '}
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigate?.('/login')}
              className="p-0 h-auto"
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 