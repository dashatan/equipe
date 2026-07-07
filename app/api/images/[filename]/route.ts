import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    const image = await prisma.image.findUnique({ where: { filename } })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.mimetype,
        'Content-Length': image.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image serve error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
