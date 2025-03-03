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
      getSupabaseAnonKey()
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
} 