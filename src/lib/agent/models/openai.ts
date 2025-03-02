import OpenAI from 'openai';
import { DEFAULT_MODEL } from '../core/config';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OpenAICallParams = {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
};

export async function callOpenAI({
  messages,
  temperature = 0.7,
  max_tokens,
  model = DEFAULT_MODEL,
}: OpenAICallParams) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content from OpenAI');
  }
} 