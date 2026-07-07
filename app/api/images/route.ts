import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const tags = searchParams.get('tags')?.split(',')

    const skip = (page - 1) * limit

    const where: any = { isPublic: true }
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId
    if (tags) where.tags = { hasSome: tags }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimetype: true,
          size: true,
          url: true,
          alt: true,
          title: true,
          description: true,
          tags: true,
          entityType: true,
          entityId: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          uploader: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
    ])

    return NextResponse.json({
      images,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Images fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const url = `/api/images/${filename}`

    const image = await prisma.image.create({
      data: {
        filename,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
        data: buffer,
        url,
        alt,
        title,
        description,
        tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
        uploader: { connect: { id: userId } },
        entityType: (entityType as any) || undefined,
        entityId: entityId || undefined,
      },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimetype: true,
        size: true,
        url: true,
        alt: true,
        title: true,
        description: true,
        tags: true,
        entityType: true,
        entityId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        uploader: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
