import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { content } = await request.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        post: { connect: { id } },
        author: { connect: { id: session.user.id } },
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
