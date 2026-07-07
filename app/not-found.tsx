import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Back home
          </Button>
        </Link>
      </div>
    </div>
  )
}
