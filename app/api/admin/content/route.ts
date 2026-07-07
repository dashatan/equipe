import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function verifyAdmin(requiredPermission: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const admin = await prisma.admin.findFirst({
    where: { userId, isActive: true },
  })
  if (!admin || !admin.permissions.includes(requiredPermission)) return null

  return { admin, userId }
}

export async function GET(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('manage_content')
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

    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          lastModifiedBy: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ])

    return NextResponse.json({
      content,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Admin content fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('manage_content')
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
      metadata,
    } = await request.json()

    const existing = await prisma.content.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const newContent = await prisma.content.create({
      data: {
        type,
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        images: images || [],
        status: status || 'draft',
        tags: tags || [],
        seoTitle: metadata?.seoTitle,
        seoDescription: metadata?.seoDescription,
        seoKeywords: metadata?.seoKeywords || [],
        showInNavigation: metadata?.showInNavigation ?? false,
        order: metadata?.order ?? 0,
        parentId: metadata?.parentId,
        isSticky: metadata?.isSticky ?? false,
        author: { connect: { id: adminData.userId } },
        lastModifiedBy: { connect: { id: adminData.userId } },
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        lastModifiedBy: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Admin content creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
