import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// This route handles server-side logout
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  
  // Sign out on the server side
  await supabase.auth.signOut();
  
  // Redirect to login page with a message
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?message=You have been logged out`);
} 