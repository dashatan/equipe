import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminData = await verifyAdmin('manage_content')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await params
    const body = await request.json()

    const updated = await prisma.content.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.status !== undefined && {
          status: body.status,
          publishedAt: body.status === 'published' ? new Date() : undefined,
        }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.metadata?.seoTitle !== undefined && { seoTitle: body.metadata.seoTitle }),
        ...(body.metadata?.seoDescription !== undefined && { seoDescription: body.metadata.seoDescription }),
        ...(body.metadata?.seoKeywords !== undefined && { seoKeywords: body.metadata.seoKeywords }),
        ...(body.metadata?.showInNavigation !== undefined && { showInNavigation: body.metadata.showInNavigation }),
        ...(body.metadata?.order !== undefined && { order: body.metadata.order }),
        ...(body.metadata?.isSticky !== undefined && { isSticky: body.metadata.isSticky }),
        lastModifiedBy: { connect: { id: adminData.userId } },
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        lastModifiedBy: { select: { id: true, name: true, avatar: true } },
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminData = await verifyAdmin('manage_content')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await params
    await prisma.content.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin content delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
