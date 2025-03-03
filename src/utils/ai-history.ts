import { createBrowserClient } from '@supabase/ssr';
import { getClientUser } from '@/lib/auth-utils';

export async function saveAIGeneration(
  prompt: string,
  response: string,
  model: string = 'gpt-4o'
) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  try {
    const user = await getClientUser();
    
    if (!user) {
      console.log('No user found, not saving AI generation');
      return;
    }
    
    const { error } = await supabase.from('ai_generations').insert({
      user_id: user.id,
      prompt,
      response,
      model,
      created_at: new Date().toISOString()
    });
    
    if (error) console.error('Error saving AI generation:', error);
  } catch (err) {
    console.error('Error in saveAIGeneration:', err);
  }
}

export async function getRecentAIGenerations(limit: number = 10) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  try {
    const user = await getClientUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching AI generations:', error);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error in getRecentAIGenerations:', err);
    return [];
  }
} 