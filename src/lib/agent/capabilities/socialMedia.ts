// src/lib/agent/capabilities/socialMedia.ts
import { AgentCapability } from '../core/types';
import { callOpenAI } from '../models/openai';
import { getSocialMediaPrompt } from '../prompts/templates';

export function getSocialMediaCapability(): AgentCapability {
  return {
    name: 'Social Media Writer',
    description: 'Creates social media content based on user prompts',
    
    execute: async (prompt: string, context?: any) => {
      // Get the appropriate template for social media writing
      const template = getSocialMediaPrompt(context?.tone || 'casual');
      
      // Enhance the prompt with platform-specific instructions if available
      let enhancedPrompt = prompt;
      if (context?.platform) {
        enhancedPrompt += ` Create this specifically for ${context.platform}.`;
      }
      
      // Call the OpenAI API with the formatted prompt
      const response = await callOpenAI({
        messages: [
          { role: 'system', content: template },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.8, // Slightly higher temperature for creativity
      });
      
      // Return the generated content
      return {
        content: response.content,
        actions: ['edit', 'shorten', 'add_hashtags'],
      };
    }
  };
} 