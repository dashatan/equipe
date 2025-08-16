import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Content from '@/lib/models/Content'
import Admin from '@/lib/models/Admin'
import { verifyToken } from '@/lib/utils/auth'

async function verifyAdmin(token: string, requiredPermission: string) {
  const userId = await verifyToken(token)
  if (!userId) return null
  
  const admin = await Admin.findOne({ user: userId, isActive: true })
  if (!admin || !admin.permissions.includes(requiredPermission)) return null
  
  return { admin, userId }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const adminData = await verifyAdmin(token, 'manage_content')
    if (!adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = {}
    
    if (type) query.type = type
    if (status) query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    const content = await Content.find(query)
      .populate('author', 'name avatar')
      .populate('lastModifiedBy', 'name avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Content.countDocuments(query)
    
    return NextResponse.json({
      content,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Admin content fetch error:', error)
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
    
    const adminData = await verifyAdmin(token, 'manage_content')
    if (!adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    const {
      type,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      images,
      status,
      tags,
      metadata
    } = await request.json()
    
    // Check if slug already exists
    const existingContent = await Content.findOne({ slug })
    if (existingContent) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }
    
    const newContent = await Content.create({
      type,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      images: images || [],
      status: status || 'draft',
      tags: tags || [],
      metadata: metadata || {},
      author: adminData.userId,
      lastModifiedBy: adminData.userId,
      publishedAt: status === 'published' ? new Date() : undefined
    })
    
    await newContent.populate([
      { path: 'author', select: 'name avatar' },
      { path: 'lastModifiedBy', select: 'name avatar' }
    ])
    
    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Admin content creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}