import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { Providers } from '@/features/app/components/Providers'
import t, { locale, getOrSetCookieLocale } from '@/lang'

export const metadata = {
  title: t.app.title,
  description: t.app.description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Use the helper from lang
  const localeParam = await getOrSetCookieLocale();
  locale.value = localeParam;

  return (
    <html lang={localeParam} suppressHydrationWarning>
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}