import './globals.css'

export const metadata = {
  title: 'GroupFinder - Find Your Activity Crew',
  description: 'Connect with people who share your passions. From hiking adventures to study groups, music practice to gaming sessions - find your perfect activity partners.',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}