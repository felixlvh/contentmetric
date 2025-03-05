import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Document {
  id?: string;
  title: string;
  content: string;
  version: number;
  last_edited_at?: string;
  created_at?: string;
  user_id?: string;
}

const supabase = createClientComponentClient();

export async function saveDocument(document: Document) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .upsert({
        id: document.id,
        title: document.title,
        content: document.content,
        version: document.version,
        last_edited_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

export async function getDocument(id: string) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading document:', error);
    throw error;
  }
}

export async function getUserDocuments() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('last_edited_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading documents:', error);
    throw error;
  }
} 