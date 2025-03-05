import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieStore = cookies();
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          const cookieStore = cookies();
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = getClient();
  
  try {
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', await params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if user has access to this document
    if (document.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = getClient();
  
  try {
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, status } = body;

    // Check if document exists and belongs to user
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', await params.id)
      .single();

    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if user has access to this document
    if (existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update document
    const { data: document, error: updateError } = await supabase
      .from('documents')
      .update({
        title,
        content,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', await params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = getClient();
  
  try {
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if document exists and belongs to user
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', await params.id)
      .single();

    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if user has access to this document
    if (existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete document
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', await params.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 