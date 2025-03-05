import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// This route is called by the Supabase Auth when a user confirms their email/phone
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
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
    try {
      const supabase = await createClient()
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`)
      }
      
      // Use redirect parameter if available, otherwise fall back to next
      const redirectPath = redirect || next
      
      // Create a response that redirects to the dashboard
      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
    } catch (err) {
      console.error('Unexpected error in auth callback route:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=An unexpected error occurred during authentication`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Could not authenticate user (no code provided)`)
} 