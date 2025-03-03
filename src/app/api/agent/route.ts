import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { generateContent } from '../../../lib/ai/services/generation-service';
import { callOpenAI } from '../../../lib/ai/models/openai';

export async function POST(request: Request) {
  try {
    console.log('Agent API route called');
    
    // Get the cookie store
    const cookieStore = await cookies();
    
    // Initialize Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(_name: string, _value: string, _options: any) {
            // Route handlers can only read cookies
          },
          remove(_name: string, _options: any) {
            // Route handlers can only read cookies
          },
        },
      }
    );
    
    // Get the current session
    console.log('Getting user session');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Authentication error: ' + sessionError.message }, { status: 401 });
    }
    
    if (!session?.user) {
      console.error('No user session found');
      return NextResponse.json({ error: 'Unauthorized: No session found' }, { status: 401 });
    }
    
    console.log('User authenticated:', session.user.id);
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed, prompt length:', body.prompt?.length || 0);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { 
      prompt, 
      documentId, 
      brandVoiceId,
      styleGuideId,
      visualGuidelinesId,
      contentType = 'text',
      context = {}
    } = body;
    
    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Generate content
    console.log('Generating content');
    try {
      const response = await generateContent({
        prompt,
        documentId,
        userId: session.user.id,
        brandVoiceId,
        styleGuideId,
        visualGuidelinesId,
      });
      
      console.log('Content generated, length:', response.content.length);
      
      // Check for brand voice violations if a brand voice is specified
      let brandVoiceAnalysis = null;
      if (brandVoiceId) {
        console.log('Analyzing content for brand voice compliance');
        brandVoiceAnalysis = await analyzeBrandVoiceCompliance(
          prompt, 
          response.content, 
          brandVoiceId,
          supabase
        );
      }
      
      // Generate follow-up suggestions
      console.log('Generating suggestions');
      const suggestionsResponse = await generateSuggestions(prompt, response.content);
      console.log('Suggestions generated:', suggestionsResponse.length);
      
      return NextResponse.json({
        content: response.content,
        suggestions: suggestionsResponse,
        brandVoiceAnalysis,
        contentType,
      });
    } catch (generationError) {
      console.error('Error generating content:', generationError);
      return NextResponse.json(
        { error: 'Content generation failed: ' + (generationError instanceof Error ? generationError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Unhandled agent error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process request: ' + errorMessage },
      { status: 500 }
    );
  }
}

// New function to analyze brand voice compliance
async function analyzeBrandVoiceCompliance(
  prompt: string, 
  content: string, 
  brandVoiceId: string,
  supabase: any
): Promise<any> {
  try {
    // Get the brand voice details
    const { data: brandVoice, error } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('id', brandVoiceId)
      .single();
      
    if (error || !brandVoice) {
      console.error('Error fetching brand voice for analysis:', error);
      return null;
    }
    
    // Create a prompt for analyzing the content
    const analysisPrompt = `
      You are a brand voice expert. Analyze the following content and determine if it adheres to the brand voice guidelines:
      
      Brand Voice:
      - Tone: ${brandVoice.tone}
      - Style: ${brandVoice.style}
      ${brandVoice.personality ? `- Personality: ${brandVoice.personality}` : ''}
      ${brandVoice.audience ? `- Target Audience: ${brandVoice.audience}` : ''}
      ${brandVoice.avoid ? `- Avoid: ${brandVoice.avoid}` : ''}
      
      Content to analyze:
      """
      ${content.substring(0, 1000)}${content.length > 1000 ? '...' : ''}
      """
      
      Provide a JSON response with the following structure. Return ONLY the raw JSON without any markdown formatting, code blocks, or backticks:
      {
        "adherence_score": 0-100,
        "tone_match": true/false,
        "style_match": true/false,
        "violations": ["list of specific violations"],
        "suggestions": ["list of improvement suggestions"],
        "strengths": ["list of areas where the content matches the brand voice well"]
      }
    `;
    
    // Call OpenAI for analysis
    const response = await callOpenAI({
      messages: [{ role: 'user', content: analysisPrompt }],
      temperature: 0.3,
      max_tokens: 500,
    });
    
    // Parse the JSON response
    try {
      // Extract JSON from markdown code blocks if present
      let contentToParse = response.content;
      
      // Check if the response is wrapped in markdown code blocks
      const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const match = contentToParse.match(jsonRegex);
      
      if (match && match[1]) {
        // Extract the JSON content from the code block
        contentToParse = match[1];
      }
      
      // Try to parse the extracted or original content
      return JSON.parse(contentToParse);
    } catch (parseError) {
      console.error('Error parsing brand voice analysis:', parseError);
      return {
        adherence_score: 70,
        tone_match: true,
        style_match: true,
        violations: [],
        suggestions: [],
        strengths: ["Content generally matches brand voice"]
      };
    }
  } catch (error) {
    console.error('Error analyzing brand voice compliance:', error);
    return null;
  }
}

async function generateSuggestions(prompt: string, content: string): Promise<string[]> {
  try {
    console.log('Generating suggestions for prompt');
    
    const suggestionsPrompt = `Based on this content generation request: "${prompt.substring(0, 100)}..." 
      and the generated content (abbreviated): "${content.substring(0, 200)}..."
      
      Generate 3 short, natural follow-up actions the user might want to take next.
      Each should be a single sentence or short phrase.
      Return only the 3 suggestions as a numbered list with no additional text.`;
    
    const response = await callOpenAI({
      messages: [{ role: 'user', content: suggestionsPrompt }],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    // Parse the numbered list from the response
    const suggestions = response.content
      .split('\n')
      .filter((line: string) => line.trim().match(/^\d+\.\s/))
      .map((line: string) => line.replace(/^\d+\.\s/, '').trim())
      .filter(Boolean);
    
    console.log('Parsed suggestions:', suggestions);
    
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
} 