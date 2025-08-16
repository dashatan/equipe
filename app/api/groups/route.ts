import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Group from '@/lib/models/Group'
import { verifyToken } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const tags = searchParams.get('tags')?.split(',')
    const skillLevel = searchParams.get('skillLevel')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = { isActive: true, isPublic: true }
    
    if (category) query.category = category
    if (location) query.location = { $regex: location, $options: 'i' }
    if (tags) query.tags = { $in: tags }
    if (skillLevel) query.skillLevel = skillLevel
    
    const groups = await Group.find(query)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Group.countDocuments(query)
    
    return NextResponse.json({
      groups,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Groups fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const {
      name,
      description,
      category,
      location,
      maxMembers,
      tags,
      activityLevel,
      ageRange,
      skillLevel,
      meetingFrequency,
      isPublic,
      coverImage,
      coordinates
    } = await request.json()
    
    const group = await Group.create({
      name,
      description,
      category,
      location,
      maxMembers,
      tags: tags || [],
      activityLevel,
      ageRange,
      skillLevel,
      meetingFrequency,
      isPublic: isPublic !== false,
      coverImage,
      coordinates,
      creator: userId,
      members: [userId],
      admins: [userId]
    })
    
    await group.populate('creator', 'name avatar')
    
    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Group creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}