import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import { verifyToken } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const groupId = searchParams.get('groupId')
    const userId = searchParams.get('userId')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = { isPublic: true }
    
    if (type) query.type = type
    if (groupId) query.group = groupId
    if (userId) query.author = userId
    
    const posts = await Post.find(query)
      .populate('author', 'name avatar location')
      .populate('group', 'name coverImage')
      .populate('activity', 'title date location')
      .populate('comments.author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Post.countDocuments(query)
    
    return NextResponse.json({
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Posts fetch error:', error)
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
      content,
      images,
      group,
      activity,
      type,
      tags,
      location,
      isPublic
    } = await request.json()
    
    const post = await Post.create({
      author: userId,
      content,
      images: images || [],
      group,
      activity,
      type: type || 'general',
      tags: tags || [],
      location,
      isPublic: isPublic !== false
    })
    
    await post.populate([
      { path: 'author', select: 'name avatar location' },
      { path: 'group', select: 'name coverImage' },
      { path: 'activity', select: 'title date location' }
    ])
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}