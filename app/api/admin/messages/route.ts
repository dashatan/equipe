import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('messages')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          recipient: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count(),
    ])

    return NextResponse.json({
      messages,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    })
  } catch (error) {
    console.error('Admin messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
