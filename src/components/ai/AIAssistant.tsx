'use client';

import { useState } from 'react';
import { useAgent } from '@/hooks/useAgent';
import { Loader2, Send, X } from 'lucide-react';

type AIAssistantProps = {
  documentId: string;
  brandVoiceId?: string;
  onInsertContent: (content: string) => void;
};

export default function AIAssistant({ 
  documentId, 
  brandVoiceId,
  onInsertContent 
}: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const { messages, isLoading, suggestions, sendPrompt } = useAgent();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    await sendPrompt({ 
      prompt, 
      documentId,
      context: { brandVoiceId }
    });
    
    setPrompt('');
    
    // Auto-focus the input after sending
    const inputElement = document.getElementById('ai-prompt-input');
    if (inputElement) {
      (inputElement as HTMLInputElement).focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendPrompt({ 
      prompt: suggestion, 
      documentId,
      context: { brandVoiceId }
    });
  };

  const handleInsertContent = (content: string) => {
    onInsertContent(content);
    // Optionally close the assistant after inserting
    // setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
      >
        AI Assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">AI Assistant</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">
            Ask me to help you write or edit content
          </p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="group">
              <div className={`
                p-2 rounded-lg ${message.role === 'user' 
                  ? 'bg-blue-100 ml-6' 
                  : 'bg-gray-100 mr-6'
                }
              `}>
                <p className="text-sm">{message.content}</p>
              </div>
              
              {message.role === 'assistant' && (
                <button 
                  onClick={() => handleInsertContent(message.content)}
                  className="text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Insert into document
                </button>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="bg-gray-100 p-2 rounded-lg mr-6 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">Thinking...</span>
          </div>
        )}
      </div>
      
      {suggestions.length > 0 && (
        <div className="p-2 border-t">
          <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-2 border-t">
        <div className="flex">
          <input
            id="ai-prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI for help..."
            className="flex-1 text-sm p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-blue-500 text-white p-2 rounded-r-lg disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
} 