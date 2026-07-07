import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { maxParticipants: true, currentParticipants: true },
    })
    if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    if (activity.currentParticipants >= activity.maxParticipants) {
      return NextResponse.json({ error: 'Activity is full' }, { status: 400 })
    }

    await prisma.activityParticipant.upsert({
      where: { activityId_userId: { activityId: id, userId: session.user.id } },
      create: { activityId: id, userId: session.user.id },
      update: {},
    })
    const count = await prisma.activityParticipant.count({ where: { activityId: id } })
    await prisma.activity.update({ where: { id }, data: { currentParticipants: count } })

    return NextResponse.json({ success: true, participants: count }, { status: 201 })
  } catch (error) {
    console.error('Join activity error:', error)
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
    await prisma.activityParticipant.delete({
      where: { activityId_userId: { activityId: id, userId: session.user.id } },
    }).catch(() => {})
    const count = await prisma.activityParticipant.count({ where: { activityId: id } })
    await prisma.activity.update({ where: { id }, data: { currentParticipants: count } })

    return NextResponse.json({ success: true, participants: count })
  } catch (error) {
    console.error('Leave activity error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
