import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('media')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        include: { uploader: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.image.count(),
    ])

    return NextResponse.json({
      images: images.map((img) => ({
        id: img.id,
        filename: img.filename,
        originalName: img.originalName,
        mimetype: img.mimetype,
        size: img.size,
        url: img.url,
        isPublic: img.isPublic,
        createdAt: img.createdAt,
        uploader: img.uploader,
      })),
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    })
  } catch (error) {
    console.error('Admin media error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('media')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Image id required' }, { status: 400 })

    await prisma.image.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin media delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
