import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'
  const code = searchParams.get('code')

  // Log the parameters for debugging
  console.log('Confirm route params:', { 
    token_hash: token_hash ? 'present' : 'missing',
    type,
    next,
    code: code ? 'present' : 'missing'
  })

  try {
    const supabase = await createClient()

    // Handle OTP verification if token_hash and type are present
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      
      if (!error) {
        // Redirect user to specified redirect URL or dashboard
        return NextResponse.redirect(new URL(next, request.url))
      } else {
        console.error('Error verifying OTP:', error)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }
    }
    
    // Handle code exchange if code is present (for magic link or OAuth)
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Redirect user to specified redirect URL or dashboard
        return NextResponse.redirect(new URL(next, request.url))
      } else {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }
    }
  } catch (error) {
    console.error('Unexpected error in confirm route:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=An unexpected error occurred during verification', request.url)
    )
  }

  // If we get here, neither token_hash+type nor code was provided
  return NextResponse.redirect(
    new URL('/auth/login?error=Could not verify email (missing verification parameters)', request.url)
  )
} 