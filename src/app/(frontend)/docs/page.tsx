'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@liveblocks/client';

interface Document {
  id: string;
  type: 'room';
  metadata?: {
    title?: string;
    lastEditedBy?: string;
    status?: 'draft' | 'published';
  };
  lastConnectionAt: string;
  createdAt: string;
}

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Link 
          href="/docs/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          New Document
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No documents yet</p>
          <Link 
            href="/docs/new" 
            className="text-blue-500 hover:text-blue-600"
          >
            Create your first document
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Link 
              key={doc.id} 
              href={`/docs/${doc.id}`}
              className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <h2 className="font-semibold mb-2">
                {doc.metadata?.title || 'Untitled Document'}
              </h2>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {new Date(doc.lastConnectionAt).toLocaleDateString()}
                </span>
                <span className="capitalize">
                  {doc.metadata?.status || 'draft'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 