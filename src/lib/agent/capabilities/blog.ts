// src/lib/agent/capabilities/blog.ts
import { AgentCapability } from '../core/types';
import { callOpenAI } from '../models/openai';
import { getBlogPrompt, getStorytellerBloggerPrompt } from '../prompts/templates';
import { getCapabilityConfig } from '../core/config';

// Import the ToneType from templates
import { ToneType } from '../prompts/templates';

// Define a type for the blog context
interface BlogContext {
  tone?: ToneType;
  style?: string;
  wordCount?: number;
  model?: string; // Model parameter to context
  temperature?: number; // Temperature parameter
  [key: string]: unknown;
}

export function getBlogCapability(): AgentCapability {
  return {
    name: 'Blog Writer',
    description: 'Creates blog content based on user prompts',
    
    execute: async (prompt: string, context?: BlogContext) => {
      // Determine which template to use based on context
      let template;
      let capabilityName = 'Blog Writer';
      
      if (context?.style === 'storyteller' || (context?.wordCount && context.wordCount >= 5000)) {
        // Use the storyteller template for long-form content or when explicitly requested
        template = getStorytellerBloggerPrompt();
        capabilityName = 'Storyteller';
      } else {
        // Otherwise use the standard blog template with specified tone
        template = getBlogPrompt(context?.tone || 'professional');
      }
      
      // Get configuration for this capability from centralized config
      const config = getCapabilityConfig(capabilityName);
      
      // Add word count instruction if specified
      let enhancedPrompt = prompt;
      if (context?.wordCount) {
        enhancedPrompt = `${prompt}\n\nPlease write approximately ${context.wordCount} words.`;
      }
      
      // Call the OpenAI API with the formatted prompt
      const response = await callOpenAI({
        messages: [
          { role: 'system', content: template },
          { role: 'user', content: enhancedPrompt }
        ],
        // Use context values if provided, otherwise use config values
        temperature: context?.temperature !== undefined ? context.temperature : config.temperature,
        max_tokens: context?.wordCount ? Math.min(4000, context.wordCount * 1.5) : undefined,
        model: context?.model || config.model,
      });
      
      // Return the generated content
      return {
        content: response.content,
        actions: ['edit', 'expand', 'simplify'],
      };
    }
  };
} 