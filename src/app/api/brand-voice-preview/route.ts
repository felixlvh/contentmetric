import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { callOpenAI } from '@/lib/agent/models/openai';
import { getContentTypeConfig } from '@/lib/agent/core/config';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      brandVoiceId,
      contentType = 'Blog Post',
      topic,
      outline,
      withBrandVoice = true // Whether to apply brand voice or generate generic content
    } = body;
    
    if (!brandVoiceId || !topic) {
      return NextResponse.json(
        { error: 'Brand voice ID and topic are required' },
        { status: 400 }
      );
    }
    
    // Try to use the authenticated server client first
    let supabase;
    let brandVoice;
    let brandVoiceError;
    
    try {
      // First try with authenticated server client
      supabase = await createServerClient();
      const result = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', brandVoiceId)
        .single();
        
      brandVoice = result.data;
      brandVoiceError = result.error;
    } catch (authError) {
      console.error('Authentication error, falling back to anonymous client:', authError);
      
      // Fall back to anonymous client if authentication fails
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Try to fetch the brand voice with anonymous client
      const result = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', brandVoiceId)
        .single();
        
      brandVoice = result.data;
      brandVoiceError = result.error;
    }
    
    // Handle errors from either client
    if (brandVoiceError) {
      console.error('Error fetching brand voice:', brandVoiceError);
      
      // Check for specific error types
      if (brandVoiceError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Brand voice not found' },
          { status: 404 }
        );
      } else if (brandVoiceError.message?.includes('auth')) {
        return NextResponse.json(
          { error: 'Authentication error: ' + brandVoiceError.message },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch brand voice details: ' + brandVoiceError.message },
        { status: 500 }
      );
    }
    
    if (!brandVoice) {
      return NextResponse.json(
        { error: 'Brand voice not found' },
        { status: 404 }
      );
    }
    
    // Create the appropriate system prompt based on content type and brand voice
    let systemPrompt;
    
    if (withBrandVoice) {
      // With brand voice applied
      systemPrompt = `You are an expert content creator specializing in ${contentType} creation.
      
      Write in a tone that is ${brandVoice.tone || 'professional'}.
      Use a style that is ${brandVoice.style || 'clear and concise'}.
      ${brandVoice.personality ? `Embody a personality that is ${brandVoice.personality}.` : ''}
      ${brandVoice.audience ? `Write for an audience that is ${brandVoice.audience}.` : ''}
      ${brandVoice.examples ? `Examples of this voice: ${brandVoice.examples}` : ''}
      ${brandVoice.avoid ? `Avoid: ${brandVoice.avoid}` : ''}
      ${brandVoice.description ? `Additional context: ${brandVoice.description}` : ''}
      
      Create content that perfectly embodies this brand voice while being:
      - Engaging and valuable to the reader
      - Well-structured with clear organization
      - Authentic and human-sounding
      
      Format the content in Markdown with proper headings, paragraphs, and emphasis where appropriate.`;
    } else {
      // Without brand voice (generic content)
      systemPrompt = `You are an expert content creator specializing in ${contentType} creation.
      
      Create standard, generic content without any distinctive brand voice or personality.
      Use a neutral, straightforward tone that could apply to any brand.
      
      Format the content in Markdown with proper headings, paragraphs, and emphasis where appropriate.`;
    }
    
    // Create the user prompt based on content type, topic and outline
    let userPrompt = `Create a sample ${contentType} about "${topic}"`;
    
    if (outline && outline.trim()) {
      userPrompt += ` following this outline:\n\n${outline}`;
    }
    
    // Get configuration for this content type from centralized config
    const config = getContentTypeConfig(contentType);
    
    // Call OpenAI to generate the content
    const response = await callOpenAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      model: config.model,
    });
    
    return NextResponse.json({
      content: response.content,
      brandVoiceApplied: withBrandVoice,
      contentType
    });
    
  } catch (error) {
    console.error('Error generating brand voice preview:', error);
    
    // More detailed error response
    let errorMessage = 'Failed to generate preview content';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Log the full error details for debugging
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      errorMessage = error.message;
      
      // Check for specific OpenAI error types
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key issue: ' + error.message;
        statusCode = 401;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'OpenAI rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('model')) {
        errorMessage = 'AI model issue: ' + error.message;
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 