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
  const [progress, setProgress] = useState(0); // Add progress state
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
    setProgress(0); // Reset progress
    
    // Add user message to state
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add a placeholder assistant message that will be updated
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: 'Thinking...',
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Simulate progress up to 90% while waiting for the API
          const newProgress = prev + (90 - prev) * 0.1;
          return Math.min(newProgress, 90);
        });
      }, 300);
      
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
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }
      
      const data: AgentResponse = await response.json();
      setProgress(100); // Set progress to 100% when done
      
      // Update the placeholder assistant message with the actual content
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: data.content } 
          : msg
      ));
      
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
      
      // Update the placeholder message to show the error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: `Error: ${errorMessage}` } 
          : msg
      ));
      
      return null;
    } finally {
      setIsLoading(false);
      setProgress(0); // Reset progress
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    messages,
    isLoading,
    progress, // Expose progress to UI components
    error,
    suggestions,
    sendPrompt,
    clearMessages,
  };
}