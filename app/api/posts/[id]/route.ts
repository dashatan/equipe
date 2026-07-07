import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true, location: true } },
        group: { select: { id: true, name: true, coverImage: true } },
        activity: { select: { id: true, title: true, date: true, location: true } },
        comments: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Post fetch error:', error)
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
    const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { content, images, tags, isPublic, location } = await request.json()
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(images !== undefined && { images }),
        ...(tags !== undefined && { tags }),
        ...(isPublic !== undefined && { isPublic }),
        ...(location !== undefined && { location }),
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Post update error:', error)
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
    const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
