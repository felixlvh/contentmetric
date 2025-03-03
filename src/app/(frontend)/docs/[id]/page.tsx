'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import AIAssistant from '../../../../components/editor/AIAssistant';

// Define a type for the document
interface Document {
  id: string;
  title: string;
  content: string;
  brand_voice_id?: string;
  updated_at: string;
  user_id: string;
  [key: string]: unknown; // For any additional fields
}

// Mock DocumentEditor component until you create the real one
const DocumentEditor = ({ initialContent, onUpdate }: { initialContent: string, onUpdate: (content: string) => void }) => {
  return (
    <div className="border p-4 min-h-[400px]">
      <textarea 
        className="w-full h-full min-h-[400px]" 
        defaultValue={initialContent}
        onChange={(e) => onUpdate(e.target.value)}
      />
    </div>
  );
};

export default function DocumentPage() {
  const params = useParams();
  const documentId = params?.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [brandVoiceId, setBrandVoiceId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDocument = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (error) {
        console.error('Error fetching document:', error);
        return;
      }
      
      setDocument(data as Document);
      setBrandVoiceId(data.brand_voice_id);
      setLoading(false);
    };
    
    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);
  
  const handleContentUpdate = async (content: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error } = await supabase
      .from('documents')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', documentId);
      
    if (error) {
      console.error('Error updating document:', error);
    }
  };
  
  const handleInsertAIContent = (content: string) => {
    // This function will be implemented based on your editor component
    // It should insert the AI-generated content at the current cursor position
    console.log('Inserting AI content:', content);
    // Example: editor.insertContent(content);
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading document...</div>;
  }
  
  if (!document) {
    return <div className="p-8 text-center">Document not found</div>;
  }
  
  return (
    <div className="relative min-h-screen">
      <h1 className="text-2xl font-bold p-4">{document.title}</h1>
      
      {/* Your document editor component */}
      <DocumentEditor 
        initialContent={document.content}
        onUpdate={handleContentUpdate}
      />
      
      {/* AI Assistant */}
      <AIAssistant 
        documentId={documentId}
        brandVoiceId={brandVoiceId}
        onInsertContent={handleInsertAIContent}
      />
    </div>
  );
} 