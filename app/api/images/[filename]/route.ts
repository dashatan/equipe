import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Image from '@/lib/models/Image'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    await dbConnect()
    
    const image = await Image.findOne({ filename: params.filename })
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.mimetype,
        'Content-Length': image.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Image serve error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}