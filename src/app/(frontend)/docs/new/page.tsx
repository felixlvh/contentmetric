'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentEditor from '@/components/editor/DocumentEditor';
import { toast } from 'sonner';

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (isDraft: boolean = true) => {
    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          status: isDraft ? 'draft' : 'published'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save document');
      }

      toast.success(isDraft ? 'Draft saved successfully' : 'Document published successfully');
      if (data.document?.id) {
        router.push(`/docs/${data.document.id}`);
      } else {
        throw new Error('No document ID returned from server');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Document</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Document Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-200 rounded-lg p-4">
            <DocumentEditor 
              content={content} 
              onChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 