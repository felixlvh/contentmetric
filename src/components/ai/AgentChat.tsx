'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Paperclip, ThumbsUp, ThumbsDown, Copy, Check, RefreshCw, MessageSquare } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface AgentChatProps {
  documentId?: string;
  brandVoiceId?: string;
  onContentGenerated?: (content: string) => void;
}

export default function AgentChat({ 
  documentId,
  brandVoiceId,
  onContentGenerated
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [parent] = useAutoAnimate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    setInput(textarea.value);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Create unique ID for the message
    const userMessageId = Date.now().toString();
    
    // Add user message to state
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    try {
      // Send to API using relative URL
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'improve',
          content: content,
          documentId,
          brandVoiceId,
          context: {
            previousMessages: messages.slice(-6), // Send last 6 messages for context
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to get response: ${response.status} ${errorData}`);
      }
      
      const data = await response.json();
      
      // Add assistant message to state
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Callback for parent component
      if (onContentGenerated) {
        onContentGenerated(data.content);
      }
      
      // Set suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add detailed error message
      let errorMessage = 'Sorry, I encountered an error while processing your request.';
      
      if (error instanceof Error) {
        errorMessage += ' Error details: ' + error.message;
      }
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-medium text-gray-700">AI Assistant</h3>
        <p className="text-xs text-gray-500">
          {brandVoiceId ? 'Using custom brand voice' : 'Using default voice'}
        </p>
      </div>
      
      {/* Messages container */}
      <div 
        ref={parent}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">How can I help you today?</h3>
              <p className="text-sm">Ask me to write or improve your content</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div 
                className={`relative group max-w-[85%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                
                {/* Action buttons for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                      aria-label="Copy to clipboard"
                    >
                      {copiedMessageId === message.id ? 
                        <Check className="h-4 w-4 text-green-500" /> : 
                        <Copy className="h-4 w-4" />
                      }
                    </button>
                  </div>
                )}
                
                {/* Feedback buttons for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center justify-end space-x-2 text-xs text-gray-500">
                    <button className="p-1 rounded-md hover:bg-gray-100 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="sr-only">Helpful</span>
                    </button>
                    <button className="p-1 rounded-md hover:bg-gray-100 flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      <span className="sr-only">Not helpful</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">Generating response...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 border-t border-gray-200 flex gap-2 overflow-x-auto bg-white">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-700 flex-shrink-0 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1 min-h-[40px]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI to write or improve your content..."
              className="w-full p-3 pr-10 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
          <span>Press Shift + Enter for a new line</span>
          <button 
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            onClick={() => setMessages([])}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Clear chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}