import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Activity from '@/lib/models/Activity'
import { verifyToken } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'upcoming'
    const groupId = searchParams.get('groupId')
    const location = searchParams.get('location')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = { isPublic: true, status }
    
    if (category) query.category = category
    if (groupId) query.group = groupId
    if (location) query.location = { $regex: location, $options: 'i' }
    
    const activities = await Activity.find(query)
      .populate('group', 'name coverImage')
      .populate('organizer', 'name avatar')
      .populate('participants', 'name avatar')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Activity.countDocuments(query)
    
    return NextResponse.json({
      activities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Activities fetch error:', error)
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
      title,
      description,
      group,
      category,
      date,
      endDate,
      location,
      maxParticipants,
      cost,
      difficulty,
      equipment,
      tags,
      requirements,
      notes,
      coordinates
    } = await request.json()
    
    const activity = await Activity.create({
      title,
      description,
      group,
      organizer: userId,
      category,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      maxParticipants,
      cost: cost || 0,
      difficulty,
      equipment: equipment || [],
      tags: tags || [],
      requirements: requirements || [],
      notes,
      coordinates,
      participants: [userId]
    })
    
    await activity.populate([
      { path: 'group', select: 'name coverImage' },
      { path: 'organizer', select: 'name avatar' }
    ])
    
    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}