// src/lib/agent/capabilities/socialMedia.ts
import { AgentCapability } from '../core/types';
import { callOpenAI } from '../models/openai';
import type { ChatCompletionChunk } from 'openai/resources/chat/completions';

// Define the response types
type NonStreamingResponse = {
  content: string;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
};

type StreamingResponse = AsyncIterable<ChatCompletionChunk>;

// Define the social media context type
interface SocialMediaContext {
  platform?: string;
  tone?: string;
  maxLength?: number;
  hashtags?: boolean;
  temperature?: number;
  model?: string;
  [key: string]: unknown;
}

export function getSocialMediaCapability(): AgentCapability {
  return {
    name: 'Social Media Post Generator',
    description: 'Creates engaging social media posts',
    
    execute: async (prompt: string, context?: SocialMediaContext) => {
      // Format the system prompt for social media content
      const platform = context?.platform || 'general social media';
      const tone = context?.tone || 'professional and engaging';
      const maxLength = context?.maxLength || 280; // Default to Twitter length
      
      const systemPrompt = `You are a social media expert. Create a ${platform} post that is:
      - Written in a ${tone} tone
      - Maximum ${maxLength} characters
      - Engaging and shareable
      ${context?.hashtags ? '- Include relevant hashtags' : ''}
      
      Make the content concise, impactful, and appropriate for the platform.`;
      
      // Call OpenAI with the social media prompt
      const response = await callOpenAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: context?.temperature ?? 0.7,
        model: context?.model,
      });

      // Type guard function to check if response is streaming
      function isStreamingResponse(resp: StreamingResponse | NonStreamingResponse): resp is StreamingResponse {
        return Symbol.asyncIterator in Object(resp);
      }

      // Handle both streaming and non-streaming responses
      const content = isStreamingResponse(response)
        ? '' // For streaming, content will be handled by the caller
        : response.content;
      
      // Return the generated content
      return {
        content,
        actions: ['edit', 'shorten', 'add_hashtags'],
      };
    }
  };
} 