import { createClient } from '@/utils/supabase/client';

export async function getClientUser() {
  const supabase = createClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session?.user || null;
  } catch (error) {
    console.error('Error in getClientUser:', error);
    return null;
  }
} 