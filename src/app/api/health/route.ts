import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if required environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Configuration error',
          details: 'Missing required environment variables'
        },
        { status: 500 }
      );
    }

    // Basic connectivity check to Supabase
    try {
      const response = await fetch(supabaseUrl);
      if (!response.ok) {
        throw new Error(`Supabase connectivity check failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Supabase connectivity error:', error);
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Supabase connectivity error',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 