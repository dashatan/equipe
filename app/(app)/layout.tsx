import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/')

  return <DashboardLayout>{children}</DashboardLayout>
}
