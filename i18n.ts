import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Can be imported from a shared config
const locales = ['en', 'es', 'fr', 'de', 'pt', 'ar'] as const
const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./i18n/messages/${locale}.json`)).default
  }
})

export { locales, defaultLocale } 