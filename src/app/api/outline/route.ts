import { NextResponse } from 'next/server';
import { getBlogCapability } from '@/lib/agent/capabilities/blog';
import { getContentTypeConfig } from '@/lib/agent/core/config';
import { createClient as createServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { topic, brandVoiceId } = body;
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    // Fetch brand voice details to get the complete tone information
    let brandVoice;
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', brandVoiceId)
        .single();
        
      if (error) throw error;
      brandVoice = data;
    } catch (error) {
      console.error('Error fetching brand voice:', error);
      return NextResponse.json(
        { error: 'Failed to fetch brand voice details' },
        { status: 500 }
      );
    }
    
    // Get the blog capability
    const blogCapability = getBlogCapability();
    
    // Create a more detailed prompt that incorporates the brand voice tones
    const toneDescription = Array.isArray(brandVoice.tone) 
      ? brandVoice.tone.join(' and ') 
      : brandVoice.tone || 'professional';
    
    const outlinePrompt = `Create a detailed, comprehensive outline for a ${toneDescription} ${brandVoice.contentType || 'blog post'} about "${topic}".
    
    The outline should:
    - Reflect the ${toneDescription} tone throughout its structure
    - Include an engaging introduction that sets the right tone
    - Have at least 5 main sections with relevant subsections
    - Include tone-appropriate section titles and descriptions
    - End with a conclusion that maintains the established tone
    
    Additional tone guidance:
    ${brandVoice.description ? `- Consider this brand context: ${brandVoice.description}` : ''}
    ${brandVoice.style ? `- Incorporate this style: ${brandVoice.style}` : ''}
    ${brandVoice.personality ? `- Reflect this personality: ${brandVoice.personality}` : ''}
    
    Format with Markdown headings and bullet points.`;
    
    // Get configuration for outlines from centralized config
    const config = getContentTypeConfig('Outline');
    
    // Execute the capability with model specification and tone information
    const result = await blogCapability.execute(outlinePrompt, { 
      tone: toneDescription,
      model: config.model,
      temperature: config.temperature
    });
    
    // Return the generated outline
    return NextResponse.json({
      outline: result.content,
      appliedTone: toneDescription
    });
    
  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
} 