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
    const like = await prisma.postLike.upsert({
      where: { postId_userId: { postId: id, userId: session.user.id } },
      create: { postId: id, userId: session.user.id },
      update: {},
    })
    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    console.error('Like error:', error)
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
    await prisma.postLike.delete({
      where: { postId_userId: { postId: id, userId: session.user.id } },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
