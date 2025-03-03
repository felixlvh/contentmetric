'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'email';

interface ContentGenerationFormProps {
  onGenerate: (content: string) => void;
}

export default function ContentGenerationForm({ onGenerate }: ContentGenerationFormProps) {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [tone, setTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Format prompt based on content type
      let prompt = '';
      
      switch (contentType) {
        case 'blog':
          prompt = `Write a blog post about "${topic}". Use a ${tone} tone.`;
          break;
        case 'social':
          prompt = `Create social media content about "${topic}". Use a ${tone} tone.`;
          break;
        case 'email':
          prompt = `Write an email about "${topic}". Use a ${tone} tone.`;
          break;
      }
      
      // Call API using relative URL
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            tone,
            contentType,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      onGenerate(data.content);
      
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Generate Content</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content-type" className="block text-sm font-medium mb-1">
            Content Type
          </label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          >
            <option value="blog">Blog Post</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Topic or Title
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the topic or title"
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="tone" className="block text-sm font-medium mb-1">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </span>
          ) : (
            'Generate Content'
          )}
        </button>
      </form>
    </div>
  );
} 