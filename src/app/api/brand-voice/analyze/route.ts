import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { content, brandVoiceId } = body;

    // Validate request
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!brandVoiceId) {
      return NextResponse.json({ error: 'Brand voice ID is required' }, { status: 400 });
    }

    // Fetch brand voice details
    const { data: brandVoice, error: brandVoiceError } = await supabase
      .from('brand_voices')
      .select('*')
      .eq('id', brandVoiceId)
      .eq('user_id', userId)
      .single();

    if (brandVoiceError || !brandVoice) {
      return NextResponse.json(
        { error: 'Brand voice not found' },
        { status: 404 }
      );
    }

    // Construct the prompt for OpenAI
    const prompt = `
      You are a brand voice analyzer. Analyze the following content against the brand voice guidelines:
      
      Brand Voice Guidelines:
      - Name: ${brandVoice.name}
      - Description: ${brandVoice.description || 'N/A'}
      - Tone: ${brandVoice.tone}
      - Style: ${brandVoice.style}
      ${brandVoice.personality ? `- Personality: ${brandVoice.personality}` : ''}
      ${brandVoice.audience ? `- Target Audience: ${brandVoice.audience}` : ''}
      ${brandVoice.avoid ? `- Things to Avoid: ${brandVoice.avoid}` : ''}
      ${brandVoice.examples && brandVoice.examples.length > 0 
        ? `- Example Sentences: ${brandVoice.examples.join('; ')}` 
        : ''}
      
      Content to Analyze:
      """
      ${content}
      """
      
      Analyze the content and provide the following in JSON format:
      1. adherence_score: A score from 0-100 indicating how well the content adheres to the brand voice
      2. tone_match: Boolean indicating if the tone matches the guidelines
      3. style_match: Boolean indicating if the style matches the guidelines
      4. violations: Array of specific violations of the brand voice guidelines
      5. suggestions: Array of suggestions to improve adherence to the brand voice
      6. strengths: Array of ways the content successfully adheres to the brand voice
      
      Return ONLY the JSON object with no additional text.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a brand voice analyzer that provides structured analysis in JSON format." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to analyze content' },
        { status: 500 }
      );
    }

    try {
      const analysisResult = JSON.parse(responseContent);
      return NextResponse.json(analysisResult);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse analysis result' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 