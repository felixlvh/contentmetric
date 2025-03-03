'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Loader2 } from 'lucide-react';

interface AICommandBarProps {
  onApplyContent: (content: string) => void;
  editorContent?: string;
}

export default function AICommandBar({ onApplyContent, editorContent = '' }: AICommandBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  
  const commands = [
    { id: 'improve', label: 'Improve Writing' },
    { id: 'shorten', label: 'Make Shorter' },
    { id: 'expand', label: 'Expand Content' },
    { id: 'tone_casual', label: 'Make Casual' },
    { id: 'tone_professional', label: 'Make Professional' },
    { id: 'fix_grammar', label: 'Fix Grammar' }
  ];
  
  const handleCommandClick = async (commandId: string) => {
    if (!editorContent.trim()) {
      alert('Please add some content to the editor first.');
      return;
    }
    
    setIsLoading(true);
    setSelectedCommand(commandId);
    
    let prompt = '';
    
    switch (commandId) {
      case 'improve':
        prompt = 'Improve this text while keeping the same meaning:';
        break;
      case 'shorten':
        prompt = 'Make this text shorter while preserving key points:';
        break;
      case 'expand':
        prompt = 'Expand this text with more details:';
        break;
      case 'tone_casual':
        prompt = 'Rewrite this text with a more casual, conversational tone:';
        break;
      case 'tone_professional':
        prompt = 'Rewrite this text with a more professional tone:';
        break;
      case 'fix_grammar':
        prompt = 'Fix any grammar, spelling, or punctuation errors in this text:';
        break;
    }
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            content: editorContent,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process command');
      }
      
      const data = await response.json();
      onApplyContent(data.content);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error applying AI command:', error);
      alert('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedCommand(null);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        disabled={isLoading}
      >
        <Sparkles className="h-4 w-4" />
        <span>AI Assist</span>
        <ChevronDown className="h-3 w-3 ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border z-10">
          <div className="py-1">
            {commands.map((command) => (
              <button
                key={command.id}
                onClick={() => handleCommandClick(command.id)}
                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading && selectedCommand === command.id ? (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <span className="h-3 w-3 mr-2" />
                )}
                {command.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 