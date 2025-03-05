'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AICommandBarProps {
  onApplyContent: (content: string) => void;
  editorContent?: string;
}

export default function AICommandBar({ onApplyContent, editorContent = '' }: AICommandBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [floatingPosition, setFloatingPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  
  const commands = [
    { id: 'improve', label: 'Improve Writing' },
    { id: 'shorten', label: 'Make Shorter' },
    { id: 'expand', label: 'Expand Content' },
    { id: 'tone_casual', label: 'Make Casual' },
    { id: 'tone_professional', label: 'Make Professional' },
    { id: 'fix_grammar', label: 'Fix Grammar' }
  ];

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setFloatingPosition(null);
      setSelectedText('');
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setFloatingPosition(null);
      setSelectedText('');
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectedText(text);
    setFloatingPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top - 10
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);
  
  const handleCommandClick = async (commandId: string) => {
    const textToProcess = selectedText || editorContent;
    
    if (!textToProcess.trim()) {
      toast.error('Please add some content or select text first.');
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
            content: textToProcess,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process command');
      }
      
      const data = await response.json();
      onApplyContent(selectedText ? 
        editorContent.replace(selectedText, data.content) : 
        data.content
      );
      setIsOpen(false);
      setFloatingPosition(null);
      
    } catch (error) {
      console.error('Error applying AI command:', error);
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedCommand(null);
    }
  };

  const renderCommandList = () => (
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
  );
  
  return (
    <>
      {/* Fixed toolbar button */}
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
        
        {isOpen && !floatingPosition && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border z-10">
            {renderCommandList()}
          </div>
        )}
      </div>

      {/* Floating menu for text selection */}
      {floatingPosition && (
        <div 
          className="fixed z-50"
          style={{
            left: `${floatingPosition.x}px`,
            top: `${floatingPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-white shadow-lg rounded-md border w-48">
            {renderCommandList()}
          </div>
        </div>
      )}
    </>
  );
} 