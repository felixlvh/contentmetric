import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Brand voice ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the brand voice exists and belongs to the user
    const { data: existingVoice, error: fetchError } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('id', body.id)
      .eq('user_id', user.id)
      .single();
      
    if (fetchError || !existingVoice) {
      return NextResponse.json(
        { error: 'Brand voice not found or access denied' },
        { status: 404 }
      );
    }
    
    // First, deactivate all brand voices for this user
    await supabase
      .from('brand_voices')
      .update({ is_active: false })
      .eq('user_id', user.id);
    
    // Then, activate the specified brand voice
    const { data, error } = await supabase
      .from('brand_voices')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error setting brand voice as active:', error);
      return NextResponse.json(
        { error: 'Failed to set brand voice as active' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in PATCH /api/brand-voice/active:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 