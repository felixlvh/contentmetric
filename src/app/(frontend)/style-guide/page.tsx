import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface TerminologyItem {
  term: string;
  alternatives?: string[];
}

interface StyleGuide {
  id: string;
  name: string;
  grammar_rules: string;
  terminology: {
    preferred: TerminologyItem[];
    avoid: string[];
  };
  formatting: {
    headings: string;
    lists: string;
    emphasis: string;
  };
  capitalization: string;
  punctuation: string;
  isActive: boolean;
}

export default async function StyleGuidePage() {
  const supabase = await createClient();
  
  // Check if the user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login if not authenticated
    redirect('/auth/login?error=Please sign in to access style guide settings');
  }
  
  // Fetch user's style guides from the database
  const { data: userStyleGuides, error: fetchError } = await supabase
    .from('style_guides')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (fetchError) {
    console.error('Error fetching style guides:', fetchError);
  }
  
  // Use template style guides if user doesn't have any
  const styleGuides: StyleGuide[] = userStyleGuides && userStyleGuides.length > 0 
    ? userStyleGuides 
    : [
      {
        id: 'business',
        name: 'Business Professional',
        grammar_rules: 'Use proper grammar and punctuation. Avoid contractions in formal documents. Use active voice.',
        terminology: {
          preferred: [
            { term: 'utilize', alternatives: ['use', 'employ'] },
            { term: 'implement', alternatives: ['put in place', 'set up'] },
            { term: 'clients', alternatives: ['customers', 'users'] }
          ],
          avoid: [
            'stuff', 'things', 'nice', 'good', 'bad', 'very'
          ]
        },
        formatting: {
          headings: 'Title case for all headings',
          lists: 'Use bullet points for unordered lists, numbered lists for sequential items',
          emphasis: 'Use bold for emphasis, italics for definitions or terms',
        },
        capitalization: 'Capitalize proper nouns, titles, and the first word of sentences',
        punctuation: 'Use Oxford comma. Use em dashes for breaks in thought. Use semicolons to separate related independent clauses.',
        isActive: true,
      },
      {
        id: 'marketing',
        name: 'Marketing Content',
        grammar_rules: 'Use active voice. Short, punchy sentences are encouraged. Contractions are acceptable.',
        terminology: {
          preferred: [
            { term: 'discover', alternatives: ['find', 'see'] },
            { term: 'transform', alternatives: ['change', 'improve'] },
            { term: 'exclusive', alternatives: ['special', 'unique'] }
          ],
          avoid: [
            'very', 'really', 'quite', 'just', 'simply'
          ]
        },
        formatting: {
          headings: 'Title case for main headings, sentence case for subheadings',
          lists: 'Use short, benefit-focused bullet points',
          emphasis: 'Use bold for key benefits, italics for testimonials',
        },
        capitalization: 'Capitalize product names and key features',
        punctuation: 'Use exclamation points sparingly. Question marks are effective for headlines.',
        isActive: false,
      },
      {
        id: 'technical',
        name: 'Technical Documentation',
        grammar_rules: 'Use present tense. Be concise and precise. Use active voice when possible.',
        terminology: {
          preferred: [
            { term: 'select', alternatives: ['click', 'choose'] },
            { term: 'enter', alternatives: ['type', 'input'] },
            { term: 'verify', alternatives: ['check', 'confirm'] }
          ],
          avoid: [
            'easy', 'simple', 'just', 'obviously', 'clearly'
          ]
        },
        formatting: {
          headings: 'Sentence case for all headings',
          lists: 'Use numbered lists for sequential procedures',
          emphasis: 'Use code formatting for commands, parameters, and file names',
        },
        capitalization: 'Capitalize proper nouns and UI elements exactly as they appear in the interface',
        punctuation: 'Use periods at the end of complete sentences in lists. Avoid exclamation points.',
        isActive: false,
      },
    ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Style Guide</h1>
          <p className="text-gray-600">Create and manage your content style guides</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Create New Style Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {styleGuides.map((guide) => (
          <div 
            key={guide.id} 
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              guide.isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{guide.name}</h3>
                <div className="flex items-center">
                  {guide.isActive && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      Active
                    </span>
                  )}
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Grammar Rules</h4>
                  <p className="text-sm text-gray-600">{guide.grammar_rules}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Terminology</h4>
                  
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-600">Preferred Terms</h5>
                    <div className="mt-1 space-y-1">
                      {guide.terminology.preferred.map((item: TerminologyItem, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-700">{item.term}</span>
                          {item.alternatives && (
                            <span className="text-gray-500"> instead of: {item.alternatives.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-600">Terms to Avoid</h5>
                    <p className="text-sm text-gray-600">{guide.terminology.avoid.join(', ')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Formatting</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600"><span className="font-medium">Headings:</span> {guide.formatting.headings}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Lists:</span> {guide.formatting.lists}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Emphasis:</span> {guide.formatting.emphasis}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Capitalization</h4>
                  <p className="text-sm text-gray-600">{guide.capitalization}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Punctuation</h4>
                  <p className="text-sm text-gray-600">{guide.punctuation}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex justify-between">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
              <button className={`text-sm font-medium ${
                guide.isActive 
                  ? 'text-gray-500 hover:text-gray-700' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}>
                {guide.isActive ? 'Deactivate' : 'Set as Active'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Style Checker</h2>
        <p className="text-gray-600 mb-6">
          Check if your content follows your style guide. Paste your content below to analyze.
        </p>
        
        <div className="border rounded-lg p-5">
          <textarea 
            className="w-full h-32 p-3 border rounded-lg mb-4" 
            placeholder="Paste your content here to check against your style guide..."
          ></textarea>
          
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Check Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 