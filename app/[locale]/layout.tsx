
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'
import { Providers } from '@/features/app/components/Providers'
import t, { locale } from '@/lang'


export const metadata = {
  title: t.app.title,
  description: t.app.description,
}

export default async function RootLayout(props: Readonly<{
  params: Promise<{ locale: string }>
  children: React.ReactNode
}>) {
  const params = await props.params
  
  locale.value = params.locale


  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <Toaster />
        <Providers locale={params.locale}>{props.children}</Providers>
      </body>
    </html>
  )
}