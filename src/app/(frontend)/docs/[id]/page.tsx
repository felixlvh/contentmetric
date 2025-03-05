'use client';

import { useEffect, useState, use, useCallback } from 'react';
import DocumentEditor from '@/components/editor/DocumentEditor';
import AICommandBar from '@/components/editor/AICommandBar';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import { ChevronRight, Clock, Hash, Type } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  user_id: string;
  created_at: string;
  updated_at: string;
}

const KEYBOARD_SHORTCUTS = [
  { key: '⌘ + S', action: 'Save document' },
  { key: '⌘ + P', action: 'Publish document' },
  { key: '⌘ + /', action: 'Show AI commands' },
];

export default function EditDocumentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const [lastSavedTitle, setLastSavedTitle] = useState<string>('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 });

  // Calculate word and character count
  useEffect(() => {
    if (document?.content) {
      const text = document.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const characters = text.length;
      setWordCount({ words, characters });
    }
  }, [document?.content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave(true);
            break;
          case 'p':
            e.preventDefault();
            handleSave(false);
            break;
          case '/':
            e.preventDefault();
            setShowShortcuts(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (doc: Document) => {
      try {
        setSaving(true);
        const response = await fetch(`/api/documents/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: doc.title,
            content: doc.content,
            status: doc.status
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save document');
        }

        setLastSavedContent(doc.content);
        setLastSavedTitle(doc.title);
        toast.success('Changes saved', { duration: 2000 });
      } catch (error) {
        console.error('Error auto-saving document:', error);
        toast.error('Failed to save changes');
      } finally {
        setSaving(false);
      }
    }, 1500), // 1.5 second delay
    [id]
  );

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/documents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        const data = await response.json();
        setDocument(data.document);
        setLastSavedContent(data.document.content);
        setLastSavedTitle(data.document.title);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document');
        toast.error('Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [id]);

  // Auto-save effect
  useEffect(() => {
    if (document && (
      document.content !== lastSavedContent || 
      document.title !== lastSavedTitle
    )) {
      debouncedSave(document);
    }
  }, [document, lastSavedContent, lastSavedTitle, debouncedSave]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const handleSave = async (isDraft: boolean = true) => {
    if (!document) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: document.title,
          content: document.content,
          status: isDraft ? 'draft' : 'published'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save document');
      }

      setDocument(data.document);
      setLastSavedContent(data.document.content);
      setLastSavedTitle(data.document.title);
      toast.success(isDraft ? 'Draft saved successfully' : 'Document published successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Failed to save document');
      toast.error(error instanceof Error ? error.message : 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleAIContentUpdate = (newContent: string) => {
    if (document) {
      setDocument({ ...document, content: newContent });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error || 'Document not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/docs" className="hover:text-gray-700">Documents</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-700">{document.title || 'Untitled'}</span>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{document.title || 'Untitled'}</h1>
          <div className="flex items-center gap-2">
            {saving ? (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Saving...
              </span>
            ) : (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Last saved {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              document.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {document.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <AICommandBar 
            onApplyContent={handleAIContentUpdate}
            editorContent={document.content}
          />
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
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value })}
            placeholder="Enter document title"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Type className="h-4 w-4" /> {wordCount.words} words
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-4 w-4" /> {wordCount.characters} characters
              </span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <DocumentEditor 
              content={document.content} 
              onChange={(content) => setDocument({ ...document, content })}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map(({ key, action }) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{action}</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded">{key}</kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 