import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze the following content and extract brand voice characteristics. Format the response as JSON:
    
Content to analyze:
${content}

Analyze the content and provide a detailed brand voice profile including:
1. A suitable name for this brand voice
2. Formality level (very_formal, formal, neutral, casual, very_casual)
3. Technical level (expert, technical, intermediate, beginner, layman)
4. Tone (list of emotional qualities)
5. Style (list of writing style characteristics)
6. Personality traits
7. Brand values
8. Industry-specific terms used
9. Communication goals
10. Target audience details
11. Things to avoid

The response should match this TypeScript type:
{
  name: string;
  description: string;
  formality_level: 'very_formal' | 'formal' | 'neutral' | 'casual' | 'very_casual';
  technical_level: 'expert' | 'technical' | 'intermediate' | 'beginner' | 'layman';
  tone: string[];
  style: string[];
  personality: string[];
  brand_values: string[];
  industry_terms: string[];
  communication_goals: string[];
  audience: {
    primary: string;
    pain_points: string[];
    goals: string[];
  };
  avoid: {
    terms: string[];
    phrases: string[];
    topics: string[];
    style_elements: string[];
  };
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert in brand voice analysis and content strategy. Analyze content to extract brand voice characteristics and provide structured feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No analysis generated');
    }

    const analysis = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing brand voice:', error);
    return NextResponse.json(
      { error: 'Failed to analyze brand voice' },
      { status: 500 }
    );
  }
} 