// src/lib/agent/capabilities/improve.ts
import { AgentCapability } from '../core/types';
import { callOpenAI } from '../models/openai';

export function getImproveCapability(): AgentCapability {
  return {
    name: 'Content Improver',
    description: 'Enhances existing content based on user requests',
    
    execute: async (prompt: string, context?: any) => {
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
        temperature: 0.6,
      });
      
      return {
        content: response.content,
        actions: ['compare', 'undo', 'enhance_further'],
      };
    }
  };
} 