import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

export const createClient = async () => {
  try {
    const cookieStore = await cookies()

    return createSupabaseServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          async get(name: string) {
            try {
              return cookieStore.get(name)?.value
            } catch (error) {
              console.error('Error getting cookie in server client:', error)
              return undefined
            }
          },
          async set(name: string, value: string, options: CookieOptions) {
            try {
              // Ensure secure cookies in production
              if (process.env.NODE_ENV === 'production') {
                options.secure = true;
                options.sameSite = 'lax';
              }
              
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error('Error setting cookie in server client:', error)
            }
          },
          async remove(name: string, options: CookieOptions) {
            try {
              // Ensure secure cookies in production
              if (process.env.NODE_ENV === 'production') {
                options.secure = true;
                options.sameSite = 'lax';
              }
              
              cookieStore.set({ name, value: '', ...options, maxAge: 0 })
            } catch (error) {
              console.error('Error removing cookie in server client:', error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Error creating server client:', error)
    throw error
  }
} 