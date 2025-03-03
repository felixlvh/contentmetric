import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// GET all brand voices for the current user
export async function GET(request: Request) {
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
    
    // Get query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // If ID is provided, fetch a single brand voice
    if (id) {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching brand voice:', error);
        return NextResponse.json(
          { error: 'Failed to fetch brand voice' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(data);
    }
    
    // Otherwise, fetch all brand voices for the user
    const { data, error } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching brand voices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch brand voices' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in GET /api/brand-voice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to create a new brand voice
export async function POST(request: Request) {
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
    if (!body.name || !body.tone || !body.style) {
      return NextResponse.json(
        { error: 'Name, tone, and style are required' },
        { status: 400 }
      );
    }
    
    // Prepare the brand voice data
    const brandVoiceData = {
      id: uuidv4(),
      name: body.name,
      description: body.description || null,
      tone: body.tone,
      style: body.style,
      personality: body.personality || null,
      audience: body.audience || null,
      examples: body.examples || [],
      avoid: body.avoid || null,
      is_active: body.is_active || false,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insert the new brand voice
    const { data, error } = await supabase
      .from('brand_voices')
      .insert(brandVoiceData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating brand voice:', error);
      return NextResponse.json(
        { error: 'Failed to create brand voice' },
        { status: 500 }
      );
    }
    
    // If this brand voice is set as active, deactivate all others
    if (brandVoiceData.is_active) {
      await supabase
        .from('brand_voices')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('id', brandVoiceData.id);
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/brand-voice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT to update an existing brand voice
export async function PUT(request: Request) {
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
    
    // Prepare the update data
    const updateData = {
      name: body.name || existingVoice.name,
      description: body.description !== undefined ? body.description : existingVoice.description,
      tone: body.tone || existingVoice.tone,
      style: body.style || existingVoice.style,
      personality: body.personality !== undefined ? body.personality : existingVoice.personality,
      audience: body.audience !== undefined ? body.audience : existingVoice.audience,
      examples: body.examples || existingVoice.examples,
      avoid: body.avoid !== undefined ? body.avoid : existingVoice.avoid,
      is_active: body.is_active !== undefined ? body.is_active : existingVoice.is_active,
      updated_at: new Date().toISOString(),
    };
    
    // Update the brand voice
    const { data, error } = await supabase
      .from('brand_voices')
      .update(updateData)
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating brand voice:', error);
      return NextResponse.json(
        { error: 'Failed to update brand voice' },
        { status: 500 }
      );
    }
    
    // If this brand voice is set as active, deactivate all others
    if (updateData.is_active) {
      await supabase
        .from('brand_voices')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('id', body.id);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in PUT /api/brand-voice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE to remove a brand voice
export async function DELETE(request: Request) {
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
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Brand voice ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the brand voice exists and belongs to the user
    const { data: existingVoice, error: fetchError } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (fetchError || !existingVoice) {
      return NextResponse.json(
        { error: 'Brand voice not found or access denied' },
        { status: 404 }
      );
    }
    
    // Delete the brand voice
    const { error } = await supabase
      .from('brand_voices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error deleting brand voice:', error);
      return NextResponse.json(
        { error: 'Failed to delete brand voice' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/brand-voice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH to set a brand voice as active
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
    console.error('Unexpected error in PATCH /api/brand-voice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 