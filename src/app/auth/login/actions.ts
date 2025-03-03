'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Get the form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string || '/dashboard'

  // Validate inputs
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Sign in with email and password
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Revalidate the layout to update the session
  revalidatePath('/', 'layout')
  
  // Redirect to the dashboard or the specified redirect path
  redirect(redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Get the form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Validate inputs
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Sign up with email and password
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to a confirmation page
  redirect('/auth/check-email')
}

export async function loginWithMagicLink(formData: FormData) {
  const supabase = await createClient()

  // Get the form data
  const email = formData.get('email') as string
  const redirectTo = formData.get('redirectTo') as string || '/dashboard'
  
  // Validate inputs
  if (!email) {
    return { error: 'Email is required' }
  }

  // Sign in with magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${redirectTo}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to a confirmation page
  redirect('/auth/check-email')
} 