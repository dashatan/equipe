import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin'

export async function GET() {
  try {
    const adminData = await verifyAdmin('analytics')
    if (!adminData) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const [
      userCount,
      groupCount,
      activityCount,
      postCount,
      messageCount,
      imageCount,
      contentCount,
      activeAdmins,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.group.count(),
      prisma.activity.count(),
      prisma.post.count(),
      prisma.message.count(),
      prisma.image.count(),
      prisma.content.count(),
      prisma.admin.count({ where: { isActive: true } }),
    ])

    const now = new Date()
    const last7 = new Date(now.getTime() - 7 * 86400000)
    const last30 = new Date(now.getTime() - 30 * 86400000)

    const [newUsers7d, newUsers30d, newPosts7d, newGroups30d, activitiesByStatus] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: last7 } } }),
      prisma.user.count({ where: { createdAt: { gte: last30 } } }),
      prisma.post.count({ where: { createdAt: { gte: last7 } } }),
      prisma.group.count({ where: { createdAt: { gte: last30 } } }),
      prisma.activity.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const usersByCategory = await prisma.group.groupBy({
      by: ['category'],
      _count: { _all: true },
    })

    return NextResponse.json({
      totals: {
        users: userCount,
        groups: groupCount,
        activities: activityCount,
        posts: postCount,
        messages: messageCount,
        images: imageCount,
        content: contentCount,
        activeAdmins,
      },
      trends: {
        newUsers7d,
        newUsers30d,
        newPosts7d,
        newGroups30d,
      },
      activitiesByStatus: activitiesByStatus.reduce((acc, s) => {
        acc[s.status] = s._count._all
        return acc
      }, {} as Record<string, number>),
      groupsByCategory: usersByCategory.map((c) => ({
        category: c.category,
        count: c._count._all,
      })),
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
