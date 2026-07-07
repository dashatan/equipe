import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const me = session.user.id

    const { searchParams } = new URL(request.url)
    const withUserId = searchParams.get('with')

    if (withUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: me, recipientId: withUserId },
            { senderId: withUserId, recipientId: me },
          ],
        },
        orderBy: { createdAt: 'asc' },
      })
      return NextResponse.json({ messages })
    }

    // Build conversation list: distinct partners + latest message + unread count
    const received = await prisma.message.findMany({
      where: { OR: [{ senderId: me }, { recipientId: me }] },
      orderBy: { createdAt: 'desc' },
    })

    const partners = new Map<string, { latest: typeof received[number]; unread: number }>()
    for (const m of received) {
      const partnerId = m.senderId === me ? (m.recipientId ?? '') : m.senderId
      if (!partnerId) continue
      const existing = partners.get(partnerId)
      if (!existing) {
        partners.set(partnerId, {
          latest: m,
          unread: m.recipientId === me && !m.isRead ? 1 : 0,
        })
      } else if (m.recipientId === me && !m.isRead) {
        existing.unread += 1
      }
    }

    const partnerIds = [...partners.keys()]
    const users = await prisma.user.findMany({
      where: { id: { in: partnerIds } },
      select: { id: true, name: true, avatar: true, location: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u]))

    const conversations = partnerIds
      .map((pid) => {
        const u = userMap.get(pid)
        const p = partners.get(pid)!
        return {
          userId: pid,
          name: u?.name ?? 'Unknown',
          avatar: u?.avatar ?? '',
          location: u?.location ?? '',
          lastMessage: p.latest.content,
          lastMessageAt: p.latest.createdAt,
          unread: p.unread,
        }
      })
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { recipientId, content, groupId } = await request.json()
    if (!content?.trim() || !recipientId) {
      return NextResponse.json({ error: 'recipientId and content are required' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        sender: { connect: { id: session.user.id } },
        recipient: { connect: { id: recipientId } },
        ...(groupId ? { group: { connect: { id: groupId } } } : {}),
      },
    })
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
