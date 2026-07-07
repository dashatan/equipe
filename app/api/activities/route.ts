import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'upcoming'
    const groupId = searchParams.get('groupId')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    const where: any = { isPublic: true, status }
    if (category) where.category = category
    if (groupId) where.groupId = groupId
    if (location) where.location = { contains: location, mode: 'insensitive' }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          group: { select: { id: true, name: true, coverImage: true } },
          organizer: { select: { id: true, name: true, avatar: true } },
          participants: {
            include: { user: { select: { id: true, name: true, avatar: true } } },
          },
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ])

    return NextResponse.json({
      activities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Activities fetch error:', error)
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
      title,
      description,
      group,
      category,
      date,
      endDate,
      location,
      maxParticipants,
      cost,
      difficulty,
      equipment,
      tags,
      requirements,
      notes,
      coordinates,
    } = await request.json()

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        group: { connect: { id: group } },
        organizer: { connect: { id: userId } },
        category,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location,
        maxParticipants,
        cost: cost || 0,
        difficulty,
        equipment: equipment || [],
        tags: tags || [],
        requirements: requirements || [],
        notes,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        participants: { create: [{ user: { connect: { id: userId } } }] },
      },
      include: {
        group: { select: { id: true, name: true, coverImage: true } },
        organizer: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
