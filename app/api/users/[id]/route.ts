import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        skills: true,
        completedActivities: true,
        rating: true,
        joinedGroups: true,
        createdAt: true,
        groupsMember: {
          include: { group: { select: { id: true, name: true, coverImage: true, category: true } } },
        },
        posts: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      ...user,
      groups: user.groupsMember.map((gm) => gm.group),
    })
  } catch (error) {
    console.error('Public user fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
