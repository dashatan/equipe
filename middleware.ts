import createI18nMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}