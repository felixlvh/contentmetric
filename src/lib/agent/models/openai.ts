import OpenAI from 'openai';
import { DEFAULT_MODEL, AIModel } from '../core/config';

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
    console.log(`Attempting to call OpenAI with model: ${model}`);
    
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
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    
    // Check if the error is related to the model not being available
    if (error instanceof Error && error.message && (
        error.message.includes('model') || 
        error.message.includes('does not exist') ||
        error.message.includes('not found') ||
        error.message.includes('not available')
      )) {
      
      console.log('Model error detected, attempting fallback to gpt-3.5-turbo');
      
      // If the specified model is causing issues, fall back to gpt-3.5-turbo
      try {
        const fallbackResponse = await openai.chat.completions.create({
          model: AIModel.GPT35Turbo, // Fallback to a reliable model
          messages,
          temperature,
          max_tokens,
        });
        
        console.log('Fallback to gpt-3.5-turbo successful');
        
        return {
          content: fallbackResponse.choices[0].message.content || '',
          usage: fallbackResponse.usage,
        };
      } catch (fallbackError) {
        console.error('Fallback to gpt-3.5-turbo also failed:', fallbackError);
        throw new Error(`Failed to generate content: ${error.message}. Fallback also failed.`);
      }
    }
    
    // For other types of errors, throw with the original message
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate content from OpenAI: ${errorMessage}`);
  }
} 