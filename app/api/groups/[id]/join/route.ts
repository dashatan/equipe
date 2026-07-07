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
    const group = await prisma.group.findUnique({
      where: { id },
      select: { maxMembers: true, currentMembers: true },
    })
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    if (group.currentMembers >= group.maxMembers) {
      return NextResponse.json({ error: 'Group is full' }, { status: 400 })
    }

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: id, userId: session.user.id } },
      create: { groupId: id, userId: session.user.id },
      update: {},
    })
    const count = await prisma.groupMember.count({ where: { groupId: id } })
    await prisma.group.update({ where: { id }, data: { currentMembers: count } })

    return NextResponse.json({ success: true, members: count }, { status: 201 })
  } catch (error) {
    console.error('Join group error:', error)
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
    const group = await prisma.group.findUnique({
      where: { id },
      select: { creatorId: true },
    })
    if (group?.creatorId === session.user.id) {
      return NextResponse.json({ error: 'Creator cannot leave their own group' }, { status: 400 })
    }

    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId: id, userId: session.user.id } },
    }).catch(() => {})
    const count = await prisma.groupMember.count({ where: { groupId: id } })
    await prisma.group.update({ where: { id }, data: { currentMembers: count } })

    return NextResponse.json({ success: true, members: count })
  } catch (error) {
    console.error('Leave group error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
