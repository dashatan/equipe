import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const message = await prisma.message.findUnique({
      where: { id },
      select: { recipientId: true, senderId: true },
    })
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    if (message.recipientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: body.isRead !== false },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Message update error:', error)
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
    const message = await prisma.message.findUnique({
      where: { id },
      select: { senderId: true, recipientId: true },
    })
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.message.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Message delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
