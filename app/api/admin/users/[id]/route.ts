import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminData = await verifyAdmin('manage_users')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        adminRoles: true,
        _count: { select: { posts: true, groupsMember: true, activitiesJoined: true } },
      },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({
      ...user,
      postCount: user._count.posts,
      groupCount: user._count.groupsMember,
      activityCount: user._count.activitiesJoined,
    })
  } catch (error) {
    console.error('Admin user fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminData = await verifyAdmin('manage_users')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await params
    const { updates } = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true, name: true, email: true, avatar: true, location: true,
        provider: true, isEmailVerified: true, createdAt: true,
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminData = await verifyAdmin('manage_users')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await params
    if (id === adminData.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin user delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
