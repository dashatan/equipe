import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Image from '@/lib/models/Image'
import { verifyToken } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const tags = searchParams.get('tags')?.split(',')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = { isPublic: true }
    
    if (entityType) query.entityType = entityType
    if (entityId) query.entityId = entityId
    if (tags) query.tags = { $in: tags }
    
    const images = await Image.find(query)
      .populate('uploader', 'name avatar')
      .select('-data') // Exclude binary data from list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Image.countDocuments(query)
    
    return NextResponse.json({
      images,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Images fetch error:', error)
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
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string
    const entityType = formData.get('entityType') as string
    const entityId = formData.get('entityId') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const url = `/api/images/${filename}`
    
    const image = await Image.create({
      filename,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      data: buffer,
      url,
      alt,
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploader: userId,
      entityType,
      entityId
    })
    
    // Return image without binary data
    const imageResponse = await Image.findById(image._id)
      .populate('uploader', 'name avatar')
      .select('-data')
    
    return NextResponse.json(imageResponse, { status: 201 })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}