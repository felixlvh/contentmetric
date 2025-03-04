// src/lib/agent/capabilities/improve.ts
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

// Define the improve context type
interface ImproveContext {
  content?: string;
  temperature?: number;
  model?: string;
  [key: string]: unknown;
}

export function getImproveCapability(): AgentCapability {
  return {
    name: 'Content Improver',
    description: 'Enhances existing content based on user requests',
    
    execute: async (prompt: string, context?: ImproveContext) => {
      // Extract the content to improve from context
      const contentToImprove = context?.content || '';
      
      if (!contentToImprove) {
        return {
          content: "I need some content to improve. Please provide the text you'd like to enhance.",
          actions: [],
        };
      }
      
      // Format the system prompt for content improvement
      const systemPrompt = `You are an expert content editor. Your task is to improve the following content based on this request: "${prompt}"
      
      Maintain the original meaning and intent while making the content more engaging, clear, and effective.`;
      
      // Call OpenAI with the content improvement prompt
      const response = await callOpenAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contentToImprove }
        ],
        temperature: context?.temperature ?? 0.6,
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
      
      return {
        content,
        actions: ['compare', 'undo', 'enhance_further'],
      };
    }
  };
} 