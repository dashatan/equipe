import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const groupId = searchParams.get('groupId')
    const userId = searchParams.get('userId')

    const skip = (page - 1) * limit

    const where: any = { isPublic: true }
    if (type) where.type = type
    if (groupId) where.groupId = groupId
    if (userId) where.authorId = userId

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true, location: true } },
          group: { select: { id: true, name: true, coverImage: true } },
          activity: { select: { id: true, title: true, date: true, location: true } },
          comments: {
            include: { author: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Posts fetch error:', error)
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

    const { content, images, group, activity, type, tags, location, isPublic } =
      await request.json()

    const post = await prisma.post.create({
      data: {
        author: { connect: { id: userId } },
        content,
        images: images || [],
        group: group ? { connect: { id: group } } : undefined,
        activity: activity ? { connect: { id: activity } } : undefined,
        type: type || 'general',
        tags: tags || [],
        location,
        isPublic: isPublic !== false,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, location: true } },
        group: { select: { id: true, name: true, coverImage: true } },
        activity: { select: { id: true, title: true, date: true, location: true } },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
