import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('groups')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (category) where.category = category

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
          _count: { select: { members: true, activities: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.group.count({ where }),
    ])

    return NextResponse.json({
      groups: groups.map((g) => ({
        ...g,
        memberCount: g._count.members,
        activityCount: g._count.activities,
      })),
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    })
  } catch (error) {
    console.error('Admin groups error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
