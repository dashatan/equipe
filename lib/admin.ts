import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function verifyAdmin(requiredPermission?: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const admin = await prisma.admin.findFirst({
    where: { userId, isActive: true },
  })
  if (!admin) return null
  if (requiredPermission && !admin.permissions.includes(requiredPermission)) return null

  return { admin, userId }
}
