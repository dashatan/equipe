import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const tags = searchParams.get('tags')?.split(',')
    const skillLevel = searchParams.get('skillLevel')

    const skip = (page - 1) * limit

    const where: any = { isActive: true, isPublic: true }
    if (category) where.category = category
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (tags) where.tags = { hasSome: tags }
    if (skillLevel) where.skillLevel = skillLevel

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
          members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.group.count({ where }),
    ])

    return NextResponse.json({
      groups,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Groups fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const {
      name,
      description,
      category,
      location,
      maxMembers,
      tags,
      activityLevel,
      ageRange,
      skillLevel,
      meetingFrequency,
      isPublic,
      coverImage,
      coordinates,
    } = await request.json()

    const group = await prisma.group.create({
      data: {
        name,
        description,
        category,
        location,
        maxMembers,
        tags: tags || [],
        activityLevel,
        ageMin: ageRange?.min ?? 18,
        ageMax: ageRange?.max ?? 65,
        skillLevel,
        meetingFrequency,
        isPublic: isPublic !== false,
        coverImage,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        creator: { connect: { id: userId } },
        members: { create: [{ user: { connect: { id: userId } } }] },
        admins: { create: [{ user: { connect: { id: userId } } }] },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Group creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
