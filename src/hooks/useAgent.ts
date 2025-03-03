'use client';

import { useState, useCallback } from 'react';

type AgentContext = {
  tone?: string;
  contentType?: string;
  previousMessages?: Array<{ role: string; content: string }>;
  [key: string]: unknown;
};

type AgentRequestParams = {
  prompt: string;
  documentId?: string;
  brandVoiceId?: string;
  context?: AgentContext;
};

type AgentResponse = {
  content: string;
  suggestions?: string[];
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function useAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sendPrompt = useCallback(async ({
    prompt,
    documentId,
    brandVoiceId,
    context,
  }: AgentRequestParams): Promise<AgentResponse | null> => {
    if (!prompt.trim() || isLoading) return null;
    
    setIsLoading(true);
    setError(null);
    
    // Add user message to state
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send to API using relative URL
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          documentId,
          brandVoiceId,
          context: {
            ...context,
            previousMessages: messages.slice(-6), // Send last 6 messages for context
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }
      
      const data: AgentResponse = await response.json();
      
      // Add assistant message to state
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.content,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
      
      return data;
      
    } catch (error: unknown) {
      console.error('Error using agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with AI agent';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    suggestions,
    sendPrompt,
    clearMessages,
  };
} 