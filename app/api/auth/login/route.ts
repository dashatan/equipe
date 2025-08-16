import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check for demo login
    if (email === 'demo@test.com' && password === 'demo') {
      const demoUser = {
        _id: 'demo-user-1',
        name: 'Alex Thompson',
        email: 'alex.demo@groupfinder.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        bio: 'Adventure enthusiast and tech professional looking to connect with like-minded people for outdoor activities and learning experiences.',
        location: 'San Francisco, CA',
        interests: ['🏔️ Hiking', '📷 Photography', '🎸 Music', '💻 Programming', '📚 Book Clubs', '🧗 Rock Climbing'],
        skills: ['Photography', 'Hiking', 'JavaScript', 'Guitar', 'Rock Climbing'],
        completedActivities: 47,
        rating: 4.8,
        joinedGroups: 12,
        isDemo: true
      }

      const token = jwt.sign(
        { userId: demoUser._id, isDemo: true },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        message: 'Demo login successful',
        user: demoUser,
        token
      })
    }

    // Find user and include password for verification
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      interests: user.interests,
      skills: user.skills,
      completedActivities: user.completedActivities,
      rating: user.rating,
      joinedGroups: user.joinedGroups
    }

    return NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}