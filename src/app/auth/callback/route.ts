import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// This route is called by the Supabase Auth when a user confirms their email/phone
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const redirectParam = requestUrl.searchParams.get('redirect')
  const redirect = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard'
  
  console.log('Auth callback route hit with params:', { 
    code: code ? 'present' : 'missing',
    next,
    redirect,
    url: request.url
  })
  
  // Handle error parameters from Supabase
  const error = requestUrl.searchParams.get('error')
  const errorCode = requestUrl.searchParams.get('error_code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  if (error || errorCode || errorDescription) {
    console.error('Auth error in callback:', { error, errorCode, errorDescription })
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error || 'Authentication error')}`
    )
  }
  
  // Get type from query params (email/phone) - might be needed for future use
  // Currently not used but keeping the parsing logic for reference
  if (requestUrl.searchParams.get('type') === 'recovery' ||
      requestUrl.searchParams.get('type') === 'invite' ||
      requestUrl.searchParams.get('type') === 'email_change' ||
      requestUrl.searchParams.get('type') === 'signup') {
    // Type is available if needed in the future
  }

  if (code) {
    const response = NextResponse.redirect(new URL(next, request.url))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url))
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(new URL('/auth/login?error=Authentication%20failed', request.url))
    }

    return response
  }

  // Return 400 if code is missing
  return NextResponse.json(
    { error: 'No code provided' },
    { status: 400 }
  )
} 