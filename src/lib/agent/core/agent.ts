// src/lib/agent/core/agent.ts
import { AgentRequestParams, AgentResponse } from './types';
import { callOpenAI } from '../models/openai';
import { getBlogCapability } from '../capabilities/blog';
import { getSocialMediaCapability } from '../capabilities/socialMedia';
import { getImproveCapability } from '../capabilities/improve';

export async function processAgentRequest({
  prompt,
  documentId,
  context,
  userId,
}: AgentRequestParams): Promise<AgentResponse> {
  // 1. Determine the user's intent
  const intent = await determineIntent(prompt);
  
  // 2. Route to the appropriate capability
  let response;
  
  switch (intent) {
    case 'write_blog':
      response = await getBlogCapability().execute(prompt, context);
      break;
    case 'write_social':
      response = await getSocialMediaCapability().execute(prompt, context);
      break;
    case 'improve_content':
      response = await getImproveCapability().execute(prompt, context);
      break;
    default:
      // Default to general assistance
      response = await provideGeneralAssistance(prompt);
  }
  
  // 3. Generate follow-up suggestions
  const suggestions = await generateSuggestions(intent, response.content);
  
  return {
    content: response.content,
    actions: response.actions,
    suggestions,
  };
}

async function determineIntent(prompt: string): Promise<string> {
  const intentPrompt = `Determine the user's intent from the following request: "${prompt}"
  
  Possible intents:
  - write_blog: User wants to write a blog post
  - write_social: User wants to create social media content
  - improve_content: User wants to improve existing content
  - general_question: User is asking a general question
  
  Intent:`;
  
  const response = await callOpenAI({
    messages: [{ role: 'user', content: intentPrompt }],
    temperature: 0.1,
    max_tokens: 50,
  });
  
  const intent = response.content.trim().toLowerCase();
  
  if (intent.includes('write_blog')) return 'write_blog';
  if (intent.includes('write_social')) return 'write_social';
  if (intent.includes('improve')) return 'improve_content';
  return 'general_question';
}

async function provideGeneralAssistance(prompt: string) {
  const response = await callOpenAI({
    messages: [
      { 
        role: 'system', 
        content: 'You are a helpful AI content assistant. Provide concise, helpful answers to content-related questions.' 
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });
  
  return {
    content: response.content,
    actions: [],
  };
}

async function generateSuggestions(intent: string, content: string): Promise<string[]> {
  const suggestionsPrompt = `Based on this ${intent} response: "${content.substring(0, 200)}..."
  
  Generate 3 short follow-up suggestions that the user might want to do next. Each should be a specific action less than 10 words:`;
  
  const response = await callOpenAI({
    messages: [{ role: 'user', content: suggestionsPrompt }],
    temperature: 0.7,
    max_tokens: 150,
  });
  
  // Parse the numbered list from the response
  const suggestions = response.content
    .split('\n')
    .filter(line => line.trim().match(/^\d+\.|\-/))
    .map(line => line.replace(/^\d+\.|\-\s*/, '').trim())
    .filter(Boolean);
  
  return suggestions.slice(0, 3);
} 