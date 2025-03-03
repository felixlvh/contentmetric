// lib/ai/services/generation-service.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { callOpenAI } from '../models/openai';

type GenerationParams = {
  prompt: string;
  documentId?: string;
  userId: string;
  brandVoiceId?: string;
  model?: string;
  styleGuideId?: string;
  visualGuidelinesId?: string;
};

// Create a Supabase client for server components
async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value;
        },
        async set(_name: string, _value: string, _options: any) {
          // Server components can only read cookies
        },
        async remove(_name: string, _options: any) {
          // Server components can only read cookies
        },
      },
    }
  );
}

export async function generateContent({
  prompt,
  documentId,
  userId,
  brandVoiceId,
  model = 'gpt-4-turbo-preview',
  styleGuideId,
  visualGuidelinesId,
}: GenerationParams) {
  try {
    console.log('Generation service called with prompt:', prompt.substring(0, 50) + '...');
    
    // Step 1: Get brand voice if specified
    let brandVoicePrompt = '';
    let styleGuidePrompt = '';
    let visualGuidelinesPrompt = '';
    
    const supabase = await createServerSupabaseClient();
    
    if (brandVoiceId) {
      console.log('Fetching brand voice with ID:', brandVoiceId);
      
      const { data: brandVoice, error: brandVoiceError } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', brandVoiceId)
        .single();
        
      if (brandVoiceError) {
        console.error('Error fetching brand voice:', brandVoiceError);
      }
        
      if (brandVoice) {
        brandVoicePrompt = `
          Write in a tone that is ${brandVoice.tone}.
          Use a style that is ${brandVoice.style}.
          ${brandVoice.personality ? `Embody a personality that is ${brandVoice.personality}.` : ''}
          ${brandVoice.audience ? `Write for an audience that is ${brandVoice.audience}.` : ''}
          ${brandVoice.examples ? `Examples of this voice: ${brandVoice.examples}` : ''}
          ${brandVoice.avoid ? `Avoid: ${brandVoice.avoid}` : ''}
          ${brandVoice.description ? `Additional context: ${brandVoice.description}` : ''}
        `;
        console.log('Using enhanced brand voice prompt');
      }
    }
    
    // Step 2: Get style guide if specified
    if (styleGuideId) {
      console.log('Fetching style guide with ID:', styleGuideId);
      
      const { data: styleGuide, error: styleGuideError } = await supabase
        .from('style_guides')
        .select('*')
        .eq('id', styleGuideId)
        .single();
        
      if (styleGuideError) {
        console.error('Error fetching style guide:', styleGuideError);
      }
        
      if (styleGuide) {
        styleGuidePrompt = `
          Follow these style guidelines:
          ${styleGuide.grammar_rules ? `Grammar rules: ${styleGuide.grammar_rules}` : ''}
          ${styleGuide.terminology ? `Use these terms: ${styleGuide.terminology}` : ''}
          ${styleGuide.formatting ? `Formatting: ${styleGuide.formatting}` : ''}
        `;
        console.log('Using style guide prompt');
      }
    }
    
    // Step 3: Get visual guidelines if specified (for image-related content)
    if (visualGuidelinesId) {
      console.log('Fetching visual guidelines with ID:', visualGuidelinesId);
      
      const { data: visualGuidelines, error: visualGuidelinesError } = await supabase
        .from('visual_guidelines')
        .select('*')
        .eq('id', visualGuidelinesId)
        .single();
        
      if (visualGuidelinesError) {
        console.error('Error fetching visual guidelines:', visualGuidelinesError);
      }
        
      if (visualGuidelines) {
        visualGuidelinesPrompt = `
          For any visual content descriptions:
          ${visualGuidelines.color_palette ? `Use these colors: ${visualGuidelines.color_palette}` : ''}
          ${visualGuidelines.image_style ? `Image style: ${visualGuidelines.image_style}` : ''}
          ${visualGuidelines.logo_usage ? `Logo usage: ${visualGuidelines.logo_usage}` : ''}
        `;
        console.log('Using visual guidelines prompt');
      }
    }
    
    // Step 4: Call OpenAI with enhanced prompts
    console.log('Calling OpenAI with model:', model);
    const systemPrompt = `You are an expert content creator. 
      ${brandVoicePrompt}
      ${styleGuidePrompt}
      ${visualGuidelinesPrompt}
      Create high-quality, engaging content based on the user's request.
      Format the content appropriately based on the content type requested.
      Ensure all content strictly adheres to the brand voice, style guide, and visual guidelines provided.`;
    
    const response = await callOpenAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      model,
    });
    
    console.log('OpenAI response received, content length:', response.content.length);
    
    // Step 5: Save the generation to database with enhanced metadata
    try {
      console.log('Saving generation to database');
      
      const { error: insertError } = await supabase.from('ai_generations').insert({
        user_id: userId,
        document_id: documentId,
        prompt,
        completion: response.content,
        model,
        brand_voice_id: brandVoiceId,
        style_guide_id: styleGuideId,
        visual_guidelines_id: visualGuidelinesId,
        created_at: new Date().toISOString(),
      });
      
      if (insertError) {
        console.error('Error saving AI generation:', insertError);
      } else {
        console.log('Generation saved successfully');
      }
    } catch (error) {
      console.error('Failed to save AI generation:', error);
      // Continue even if saving fails
    }
    
    return response;
  } catch (error) {
    console.error('Error in generateContent:', error);
    throw error; // Re-throw to be handled by the API route
  }
} 