'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { GenericPageSkeleton } from '@/components/ui/loading-skeleton';
import { useAuth } from '@/lib/auth';

// Define a type for documents
interface Document {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  updated_at: string;
  user_id: string;
}

export default function DocsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    async function fetchDocuments() {
      try {
        // If auth is still loading, wait for it
        if (isLoading) return;
        
        // The middleware should handle redirects, but this is a fallback
        if (!user) {
          setError('Auth session missing! Please log in again.');
          setLoading(false);
          return;
        }
        
        const userId = user.id;
        const supabase = createClient();
        
        // Check if the documents table exists
        const { error: tableCheckError } = await supabase
          .from('documents')
          .select('count')
          .limit(1)
          .single();
        
        // Only try to fetch documents if the table exists
        if (!tableCheckError) {
          // Fetch user's documents
          const { data, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
          
          if (fetchError) {
            console.error('Error fetching documents:', fetchError.message);
            setError('Unable to load your documents. Please try again later.');
          } else {
            setDocuments(data as Document[] || []);
          }
        } else {
          // Use mock data since the table doesn't exist
          setDocuments([
            {
              id: 'mock-1',
              title: 'Welcome to ContentMetric',
              description: 'An introduction to the platform',
              category: 'Getting Started',
              status: 'published',
              user_id: userId,
              updated_at: new Date().toISOString()
            },
            {
              id: 'mock-2',
              title: 'Content Strategy Guide',
              description: 'Learn how to create effective content',
              category: 'Guides',
              status: 'published',
              user_id: userId,
              updated_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
            },
            {
              id: 'mock-3',
              title: 'SEO Best Practices',
              description: 'Optimize your content for search engines',
              category: 'SEO',
              status: 'draft',
              user_id: userId,
              updated_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ]);
        }
      } catch (err) {
        console.error('Unexpected error in docs page:', err);
        setError('An error occurred while loading your documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDocuments();
  }, [user, isLoading]);
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <GenericPageSkeleton />;
  }
  
  // Show loading state while fetching documents
  if (loading) {
    return <GenericPageSkeleton />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Documents</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <div className="flex space-x-3">
          <Link href="/templates" className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition">
            Templates
          </Link>
          <Link href="/docs/new" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Create New
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="blog">Blog</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="w-full md:w-auto md:flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search documents..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Documents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {documents.length > 0 ? (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">{doc.description?.substring(0, 60)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.category || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.updated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/docs/${doc.id}`} className="text-blue-600 hover:text-blue-900 mr-3">Edit</Link>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">{documents.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new document.</p>
            <div className="mt-6">
              <Link href="/docs/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create document
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 