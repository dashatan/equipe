import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, avatar: true, location: true } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        admins: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        activities: {
          where: { status: { in: ['upcoming', 'ongoing'] } },
          orderBy: { date: 'asc' },
        },
        posts: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    return NextResponse.json(group)
  } catch (error) {
    console.error('Group fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const existing = await prisma.group.findUnique({ where: { id }, select: { creatorId: true } })
    if (!existing) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    if (existing.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const group = await prisma.group.update({ where: { id }, data: body })
    return NextResponse.json(group)
  } catch (error) {
    console.error('Group update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const existing = await prisma.group.findUnique({ where: { id }, select: { creatorId: true } })
    if (!existing) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    if (existing.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.group.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Group delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
