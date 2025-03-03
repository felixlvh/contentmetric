import { createBrowserClient } from '@supabase/ssr'

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

export function createClient() {
  try {
    return createBrowserClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          get(name) {
            return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
          },
          set(name, value, options) {
            let cookie = `${name}=${value}`
            if (options.maxAge) {
              cookie += `; Max-Age=${options.maxAge}`
            }
            if (options.path) {
              cookie += `; Path=${options.path}`
            }
            if (process.env.NODE_ENV === 'production') {
              cookie += '; Secure; SameSite=Lax'
              if (options.domain) {
                cookie += `; Domain=${options.domain}`
              }
            }
            document.cookie = cookie
          },
          remove(name, options) {
            let cookie = `${name}=; Max-Age=0`
            if (options.path) {
              cookie += `; Path=${options.path}`
            }
            if (process.env.NODE_ENV === 'production') {
              cookie += '; Secure; SameSite=Lax'
              if (options.domain) {
                cookie += `; Domain=${options.domain}`
              }
            }
            document.cookie = cookie
          },
        },
        auth: {
          detectSessionInUrl: true,
          flowType: 'pkce',
          autoRefreshToken: true,
          persistSession: true,
          storage: {
            getItem: (key) => {
              try {
                const item = localStorage.getItem(key)
                return item
              } catch (error) {
                console.error('Error reading from localStorage:', error)
                return null
              }
            },
            setItem: (key, value) => {
              try {
                localStorage.setItem(key, value)
              } catch (error) {
                console.error('Error writing to localStorage:', error)
              }
            },
            removeItem: (key) => {
              try {
                localStorage.removeItem(key)
              } catch (error) {
                console.error('Error removing from localStorage:', error)
              }
            },
          },
        },
        cookieOptions: {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        },
      }
    )
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
} 