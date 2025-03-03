import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/docs',
  '/templates',
  '/chats',
  '/brand-voice',
  '/settings',
  '/profile',
]

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/signup',
]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for server-side authentication
  // Note: In middleware, we still use the request.cookies approach as it's not affected by the Next.js 15 changes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          } catch (error) {
            console.error('Error setting cookie in middleware:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          } catch (error) {
            console.error('Error removing cookie in middleware:', error)
          }
        },
      },
    }
  )

  // Get the current path from the request URL
  const path = request.nextUrl.pathname
  
  // Check if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user
  
  // Handle protected routes - redirect to login if not authenticated
  if (protectedRoutes.some(route => path.startsWith(route)) && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('message', 'Please log in to access this page')
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Handle auth routes - redirect to dashboard if already authenticated
  if (authRoutes.some(route => path.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes (API endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 