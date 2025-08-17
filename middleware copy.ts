import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for a static file
  if (staticExtensions.some((ext) => pathname.endsWith(ext)) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value
  const isAuthRoute = pathname === '/auth'

  // If no token and trying to access protected route, redirect to auth
  if (!token && !isAuthRoute) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // If has token and trying to access auth page, redirect to home
  if (token && isAuthRoute) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}

// List of static file extensions that should bypass middleware
const staticExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.ico',
  '.css',
  '.js',
  '.json',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
]
