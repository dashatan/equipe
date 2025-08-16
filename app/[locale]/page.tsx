import { Dashboard } from '@/features/dashboard/components/Dashboard'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('landing')
  
  return <Dashboard />
}