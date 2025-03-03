'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type BrandVoice = {
  id: string;
  name: string;
  description: string | null;
  tone: string;
  style: string;
  personality: string | null;
  audience: string | null;
  examples: string[] | null;
  avoid: string | null;
  is_active: boolean;
  created_at: string;
};

type AnalysisResult = {
  adherence_score: number;
  tone_match: boolean;
  style_match: boolean;
  violations: string[];
  suggestions: string[];
  strengths: string[];
};

type BrandVoiceAnalyzerProps = {
  brandVoices: BrandVoice[];
  activeVoiceId?: string;
};

export default function BrandVoiceAnalyzer({ brandVoices, activeVoiceId }: BrandVoiceAnalyzerProps) {
  const [content, setContent] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState(activeVoiceId || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Clear previous results when content changes
    setResult(null);
    setError(null);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceId(e.target.value);
    // Clear previous results when voice changes
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    // Validate inputs
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    if (!selectedVoiceId) {
      setError('Please select a brand voice');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/brand-voice/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          brandVoiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Brand Voice Analyzer</h2>
      <p className="text-gray-600 mb-6">
        Check if your content matches your brand voice. Paste your content below to analyze.
      </p>
      
      <div className="border rounded-lg p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="brand-voice-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Brand Voice
          </label>
          <select
            id="brand-voice-select"
            value={selectedVoiceId}
            onChange={handleVoiceChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a brand voice</option>
            {brandVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
        
        <textarea 
          className="w-full h-32 p-3 border rounded-lg mb-4" 
          placeholder="Paste your content here to analyze..."
          value={content}
          onChange={handleContentChange}
        />
        
        <div className="flex justify-end">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim() || !selectedVoiceId}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Content'
            )}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Adherence Score:</span>
                <span className={`font-bold text-lg ${getScoreColor(result.adherence_score)}`}>
                  {result.adherence_score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    result.adherence_score >= 80 ? 'bg-green-600' : 
                    result.adherence_score >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${result.adherence_score}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${result.tone_match ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Tone Match: <span className="font-medium">{result.tone_match ? 'Yes' : 'No'}</span></span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${result.style_match ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Style Match: <span className="font-medium">{result.style_match ? 'Yes' : 'No'}</span></span>
              </div>
            </div>
            
            {result.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.violations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-700 mb-2">Violations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {result.violations.map((violation, index) => (
                    <li key={index} className="text-sm text-gray-700">{violation}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Suggestions for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 