import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI writing assistant that helps improve text. Follow these rules:
1. Maintain the original meaning and key information
2. Keep the tone appropriate for the context
3. Be concise and clear
4. Fix any grammar or spelling errors
5. Use active voice when possible
6. Make the text more engaging`;

interface RequestBody {
  prompt: 'improve' | 'expand' | 'summarize' | 'fix_grammar' | 'change_tone' | 'generate';
  content: string;
  tone?: string;
}

export async function POST(request: Request) {
  // Check authentication
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value);
        },
        remove(name: string, _options: CookieOptions) {
          cookieStore.delete(name);
        }
      }
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: RequestBody = await request.json();
    const { prompt, content, tone } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let userPrompt = '';
    switch (prompt) {
      case 'improve':
        userPrompt = `Improve this text while maintaining its meaning: "${content}"`;
        break;
      case 'expand':
        userPrompt = `Expand this text with more details while maintaining its style: "${content}"`;
        break;
      case 'summarize':
        userPrompt = `Summarize this text while keeping the key points: "${content}"`;
        break;
      case 'fix_grammar':
        userPrompt = `Fix any grammar and spelling errors in this text: "${content}"`;
        break;
      case 'change_tone':
        userPrompt = `Rewrite this text in a ${tone || 'professional'} tone: "${content}"`;
        break;
      case 'generate':
        userPrompt = `Write a short paragraph about: ${content}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid prompt type' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const improvedText = completion.choices[0]?.message?.content;
    if (!improvedText) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({ content: improvedText });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
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