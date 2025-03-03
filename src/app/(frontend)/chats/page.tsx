'use client';

import { useState } from 'react';
import AgentChat from '@/components/ai/AgentChat';
import { BrandVoice } from '@/types/brand-voice';
import { useEffect } from 'react';

export default function ChatPage() {
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [selectedBrandVoice, setSelectedBrandVoice] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brand voices when component mounts
  useEffect(() => {
    const fetchBrandVoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/brand-voice');
        
        if (!response.ok) {
          throw new Error('Failed to fetch brand voices');
        }
        
        const data = await response.json();
        setBrandVoices(data);
        
        // Set active brand voice as default if available
        const activeBrandVoice = data.find((voice: BrandVoice) => voice.is_active);
        if (activeBrandVoice) {
          setSelectedBrandVoice(activeBrandVoice.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching brand voices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandVoices();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Chat with AI Assistant</h1>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700 mb-1">
              Select Brand Voice
            </label>
            <select
              id="brandVoice"
              value={selectedBrandVoice || ''}
              onChange={(e) => setSelectedBrandVoice(e.target.value || undefined)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isLoading || brandVoices.length === 0}
            >
              <option value="">No brand voice (generic)</option>
              {brandVoices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} {voice.is_active ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          {selectedBrandVoice && (
            <div className="mt-2 md:mt-0">
              <a 
                href={`/brand-voice/${selectedBrandVoice}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Brand Voice Details
              </a>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
        
        {selectedBrandVoice && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Active Brand Voice:</strong> Your AI assistant will respond using the selected brand voice characteristics.
            </p>
          </div>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto">
        <AgentChat brandVoiceId={selectedBrandVoice} />
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <h2 className="font-medium text-gray-700 mb-2">Tips for effective communication:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be specific about what you want the AI to help you with</li>
          <li>Provide context about your audience and goals</li>
          <li>Ask for revisions if the tone or style doesn&apos;t match your expectations</li>
          <li>Try different brand voices to see which best fits your needs</li>
        </ul>
      </div>
    </div>
  );
}