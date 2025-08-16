import { redirect } from '@/lib/navigation'
import { defaultLocale } from '@/i18n'

export default function GlobalNotFound() {
  redirect(`/${defaultLocale}`)
} 