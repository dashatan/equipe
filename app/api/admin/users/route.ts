import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function verifyAdmin(requiredPermission: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const admin = await prisma.admin.findFirst({
    where: { userId, isActive: true },
  })
  if (!admin || !admin.permissions.includes(requiredPermission)) return null

  return { admin, userId }
}

export async function GET(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('manage_users')
    if (!adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const provider = searchParams.get('provider')

    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (provider) where.provider = provider

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminData = await verifyAdmin('manage_users')
    if (!adminData) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { userId, updates } = await request.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
