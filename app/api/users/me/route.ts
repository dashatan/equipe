import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        groupsMember: { include: { group: { select: { id: true, name: true, coverImage: true, category: true } } } },
        activitiesJoined: { include: { activity: { select: { id: true, title: true, date: true, location: true, status: true } } } },
        posts: { orderBy: { createdAt: 'desc' }, take: 10 },
        adminRoles: { select: { role: true, permissions: true } },
      },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      interests: user.interests,
      skills: user.skills,
      completedActivities: user.completedActivities,
      rating: user.rating,
      joinedGroups: user.joinedGroups,
      createdAt: user.createdAt,
      groups: user.groupsMember.map((gm) => gm.group),
      activities: user.activitiesJoined.map((ap) => ap.activity),
      posts: user.posts,
      adminRoles: user.adminRoles,
    })
  } catch (error) {
    console.error('User me fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, avatar, bio, location, interests, skills } = await request.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(interests !== undefined && { interests }),
        ...(skills !== undefined && { skills }),
      },
      select: {
        id: true, name: true, email: true, avatar: true, bio: true,
        location: true, interests: true, skills: true,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
