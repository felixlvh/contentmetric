'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AgentChat from '@/components/ai/AgentChat';
import { createClient } from '@/utils/supabase/client';
import { DashboardSkeleton, GenericPageSkeleton } from '@/components/ui/loading-skeleton';
import { useAuth } from '@/lib/auth';

// Define a type for documents
interface Document {
  id: string;
  title: string;
  content?: string;
  status?: string;
  updated_at: string;
  user_id: string;
  [key: string]: unknown;
}

// Simple inline RecentDocuments component
const RecentDocuments = ({ documents }: { documents: Document[] }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No documents found. Create your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg truncate">{doc.title || 'Untitled Document'}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(doc.updated_at).toLocaleDateString()}
          </p>
          <div className="mt-2 flex">
            <Link href={`/docs/${doc.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // If auth is still loading, wait for it
        if (isLoading) return;
        
        // The middleware should handle redirects, but this is a fallback
        if (!isAuthenticated || !user) {
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
        
        let docs: Document[] = [];
        
        // Only try to fetch documents if the table exists
        if (!tableCheckError) {
          // Fetch user's recent documents
          const { data: documentsData, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(5);
          
          if (fetchError) {
            console.error('Error fetching documents:', fetchError.message);
            setError('Unable to load your documents. Please try again later.');
          } else {
            docs = documentsData as Document[] || [];
          }
        } else {
          // Use mock data since the table doesn't exist
          setUsingMockData(true);
          docs = [
            {
              id: 'mock-1',
              title: 'Welcome to ContentMetric',
              status: 'published',
              user_id: userId,
              updated_at: new Date().toISOString(),
              content: 'This is a sample document to help you get started.'
            },
            {
              id: 'mock-2',
              title: 'Getting Started Guide',
              status: 'published',
              user_id: userId,
              updated_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              content: 'Learn how to use ContentMetric effectively.'
            },
            {
              id: 'mock-3',
              title: 'Draft Document',
              status: 'draft',
              user_id: userId,
              updated_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              content: 'This is a draft document you can edit.'
            }
          ];
        }
        
        setDocuments(docs);
      } catch (err) {
        console.error('Unexpected error in dashboard:', err);
        setError('An error occurred while loading the dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [user, isLoading, isAuthenticated, router]);
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  // Show loading state while fetching documents
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {usingMockData && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You&apos;re viewing sample data because the documents table hasn&apos;t been set up in the database yet.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
              <Link href="/docs/new" className="text-blue-500 hover:text-blue-700">
                + New Document
              </Link>
            </div>
            
            <Suspense fallback={<div>Loading documents...</div>}>
              <RecentDocuments documents={documents} />
            </Suspense>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-semibold mb-4">Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/templates" 
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center text-center"
              >
                <span className="block font-medium">Browse Templates</span>
                <span className="text-sm text-gray-500">Use pre-made content structures</span>
              </Link>
              <Link 
                href="/brand-voice" 
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center text-center"
              >
                <span className="block font-medium">Brand Voice</span>
                <span className="text-sm text-gray-500">Manage your content tone and style</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <AgentChat />
          </div>
        </div>
      </div>
    </div>
  );
} 