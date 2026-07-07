import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true, coverImage: true } },
        organizer: { select: { id: true, name: true, avatar: true, location: true } },
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    })
    if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    return NextResponse.json(activity)
  } catch (error) {
    console.error('Activity fetch error:', error)
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
    const existing = await prisma.activity.findUnique({ where: { id }, select: { organizerId: true } })
    if (!existing) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    if (existing.organizerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const activity = await prisma.activity.update({ where: { id }, data: body })
    return NextResponse.json(activity)
  } catch (error) {
    console.error('Activity update error:', error)
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
    const existing = await prisma.activity.findUnique({ where: { id }, select: { organizerId: true } })
    if (!existing) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    if (existing.organizerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.activity.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Activity delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
