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

// Define public routes that should never redirect
const publicRoutes = [
  '/api/health',
  '/_next',
  '/static',
  '/images',
  '/favicon.ico',
  '/auth/callback',
]

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  return url;
};

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }
  return key;
};

export async function middleware(request: NextRequest) {
  try {
    // Get the current path from the request URL
    const path = request.nextUrl.pathname

    // Skip middleware for public routes
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next();
    }

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create a Supabase client for server-side authentication
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          get(name: string) {
            try {
              return request.cookies.get(name)?.value
            } catch (error) {
              console.error('Error getting cookie in middleware:', error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              // Ensure secure cookies in production
              if (process.env.NODE_ENV === 'production') {
                options.secure = true;
                options.sameSite = 'lax';
                options.domain = request.headers.get('host')?.split(':')[0];
                options.path = '/';
              }
              
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
              // Ensure secure cookies in production
              if (process.env.NODE_ENV === 'production') {
                options.secure = true;
                options.sameSite = 'lax';
                options.domain = request.headers.get('host')?.split(':')[0];
                options.path = '/';
              }
              
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
    
    // Check if the user is authenticated
    let isAuthenticated = false;
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        if (error.name === 'AuthSessionMissingError') {
          console.log('No auth session found, user is not authenticated')
        } else {
          console.error('Error getting user in middleware:', error)
        }
      }
      isAuthenticated = !!user
    } catch (error) {
      console.error('Unexpected error checking authentication:', error)
    }

    // Prevent redirect loops
    const isRedirectLoop = request.headers.get('x-middleware-redirect') === 'true'
    if (isRedirectLoop) {
      console.warn('Detected redirect loop, allowing request to continue')
      return response
    }
    
    // Handle protected routes - redirect to login if not authenticated
    if (protectedRoutes.some(route => path.startsWith(route)) && !isAuthenticated) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('message', 'Please log in to access this page')
      redirectUrl.searchParams.set('redirect', path)
      const redirectResponse = NextResponse.redirect(redirectUrl)
      redirectResponse.headers.set('x-middleware-redirect', 'true')
      return redirectResponse
    }
    
    // Handle auth routes - redirect to dashboard if already authenticated
    if (authRoutes.some(route => path.startsWith(route)) && isAuthenticated) {
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
      redirectResponse.headers.set('x-middleware-redirect', 'true')
      return redirectResponse
    }
    
    return response
  } catch (error) {
    console.error('Error in middleware:', error)
    // In case of error, allow the request to continue but log the error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
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