'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Trash2, ArrowLeft } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { BrandVoice } from '@/types/brand-voice';

// Step type for the form
type FormStep = 'content' | 'generating' | 'review';

type ExampleContent = {
  id: string;
  type: 'blog' | 'social' | 'email' | 'website' | 'ad' | 'documentation';
  content: string;
  metadata: {
    content_type: string;
    target_audience?: string;
    performance_metrics?: {
      engagement_rate?: number;
      conversion_rate?: number;
      feedback_score?: number;
    };
    context?: {
      platform?: string;
      campaign?: string;
      objective?: string;
    };
    analysis?: {
      tone_score: number;
      style_match: number;
      vocabulary_fit: number;
    };
  };
  created_at: string;
};

interface BrandVoiceFormProps {
  brandVoice?: BrandVoice;
  onSubmit: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function BrandVoiceForm({ brandVoice, onSubmit, onCancel, isEdit = false }: BrandVoiceFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('content');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');
  const [formData, setFormData] = useState<Partial<BrandVoice>>({
    name: brandVoice?.name || '',
    description: brandVoice?.description || '',
    formality_level: brandVoice?.formality_level || 'neutral',
    technical_level: brandVoice?.technical_level || 'beginner',
    tone: brandVoice?.tone || [],
    style: brandVoice?.style || [],
    personality: brandVoice?.personality || [],
    brand_values: brandVoice?.brand_values || [],
    industry_terms: brandVoice?.industry_terms || [],
    communication_goals: brandVoice?.communication_goals || [],
    content_types: brandVoice?.content_types || {},
    audience: brandVoice?.audience || {
      primary_demographics: [],
      secondary_demographics: [],
      pain_points: [],
      goals: []
    },
    avoid: brandVoice?.avoid || {
      terms: [],
      phrases: [],
      topics: [],
      style_elements: []
    },
    example_content: brandVoice?.example_content || [],
    is_active: brandVoice?.is_active || false,
    created_at: brandVoice?.created_at || '',
    updated_at: brandVoice?.updated_at || '',
    user_id: brandVoice?.user_id || '',
  });

  // Form field handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Function to handle step navigation
  const handleNextStep = () => {
    switch (currentStep) {
      case 'content':
        if (validateContentStep()) {
          setCurrentStep('generating');
          handleGenerateVoice();
        }
        break;
      case 'generating':
        // This step is handled by the generation process
        break;
      case 'review':
        handleSubmit();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'review':
        setCurrentStep('content');
        break;
      default:
        // Can't go back from content or generating
        break;
    }
  };

  // Function to handle voice generation
  const handleGenerateVoice = async () => {
    try {
      setIsSubmitting(true);
      
      // Call the AI analysis endpoint
      const response = await fetch('/api/analyze-brand-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.example_content?.[0]?.content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const analysis = await response.json();
      
      // Update form data with AI-generated attributes
      setFormData(prev => ({
        ...prev,
        name: analysis.name || 'Generated Brand Voice',
        description: analysis.description,
        formality_level: analysis.formality_level,
        technical_level: analysis.technical_level,
        tone: analysis.tone,
        style: analysis.style,
        personality: analysis.personality,
        brand_values: analysis.brand_values,
        industry_terms: analysis.industry_terms,
        communication_goals: analysis.communication_goals,
        audience: {
          primary: analysis.audience.primary,
          pain_points: analysis.audience.pain_points,
          goals: analysis.audience.goals
        },
        avoid: {
          terms: analysis.avoid.terms,
          phrases: analysis.avoid.phrases,
          topics: analysis.avoid.topics,
          style_elements: analysis.avoid.style_elements
        }
      }));
      
      // Move to review step
      setCurrentStep('review');
    } catch (err) {
      console.error('Error generating voice:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate brand voice');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified validation
  const validateContentStep = () => {
    if (!formData.example_content?.length) {
      setError('Please add at least one example');
      return false;
    }
    
    const hasValidContent = formData.example_content.some(content => 
      content.content.length >= 1000
    );

    if (!hasValidContent) {
      setError('Please ensure your example has 1000 characters or more');
      return false;
    }

    setError(null);
    return true;
  };

  // Original form submission logic
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        // Remove any null or undefined values
        tone: formData.tone?.filter(Boolean) || [],
        style: formData.style?.filter(Boolean) || [],
        personality: formData.personality?.filter(Boolean) || [],
      };

      const url = isEdit ? `/api/brand-voice/${brandVoice?.id}` : '/api/brand-voice';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save brand voice');
      }

      router.refresh();
      onSubmit();
    } catch (err) {
      console.error('Error saving brand voice:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddText = () => {
    const characterCount = textContent.length;
    if (characterCount < 1000) return;

    const newContent: ExampleContent = {
      id: crypto.randomUUID(),
      type: 'blog',
      content: textContent,
      metadata: {
        content_type: 'blog',
        analysis: {
          tone_score: 0,
          style_match: 0,
          vocabulary_fit: 0
        }
      },
      created_at: new Date().toISOString(),
    };

    setFormData(prev => ({
      ...prev,
      example_content: [...(prev.example_content || []), newContent],
    }));

    setTextContent('');
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'content':
        return renderContentStep();
      case 'generating':
        return renderGeneratingStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  const renderContentStep = () => {
    const characterCount = textContent.length;
    const isValidLength = characterCount >= 1000;

    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add Example Content</h3>
        <p className="text-gray-600 mb-6">
          Add up to 8 examples of content in the Brand Voice. The more on-brand and quality the examples are, the better your voice will be.
        </p>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            <Tab className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
               }`
            }>
              Paste text
            </Tab>
            <Tab className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
               }`
            }>
              Add URLs
            </Tab>
            <Tab className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
               }`
            }>
              Upload files
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              {/* Text input panel */}
              <div className="space-y-4">
                <textarea
                  className="w-full h-48 p-3 border rounded-lg"
                  placeholder="Paste a blog, tweet, email, or any other content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span>1000 character minimum</span>
                    <div className="h-1 w-48 bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          isValidLength ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((characterCount / 1000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${isValidLength ? 'text-green-600' : 'text-gray-600'}`}>
                      {characterCount}/1000
                    </span>
                    <button
                      type="button"
                      onClick={handleAddText}
                      disabled={!isValidLength || formData.example_content?.length === 8}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isValidLength && formData.example_content?.length !== 8
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add text
                    </button>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              {/* URL input panel */}
              <div className="text-center py-8 text-gray-500">
                URL input coming soon
              </div>
            </Tab.Panel>
            <Tab.Panel>
              {/* File upload panel */}
              <div className="text-center py-8 text-gray-500">
                File upload coming soon
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Added content</h4>
            <span className="text-sm text-gray-500">
              {formData.example_content?.length || 0}/8 sources
            </span>
          </div>
          {formData.example_content?.length ? (
            <div className="space-y-2">
              {formData.example_content.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{content.content.substring(0, 50)}...</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        example_content: prev.example_content?.filter(c => c.id !== content.id) || []
                      }));
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No sources added yet.</p>
              <p className="text-sm text-gray-400">Use the options above to add sources.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGeneratingStep = () => (
    <div className="p-6 text-center">
      <h3 className="text-xl font-semibold mb-4">Generating Brand Voice</h3>
      <p className="text-gray-600 mb-8">
        Analyzing your uploads to craft your voice. Most process quickly, but larger uploads might take a bit longer.
      </p>
      <div className="flex justify-center mb-8">
        <div className="animate-pulse">
          {/* Add your loading animation here */}
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Review Your Brand Voice</h3>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Generated Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Voice Characteristics</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Formality:</span> {formData.formality_level}</p>
              <p><span className="font-medium">Technical Level:</span> {formData.technical_level}</p>
              <p><span className="font-medium">Tone:</span> {formData.tone?.join(', ')}</p>
              <p><span className="font-medium">Style:</span> {formData.style?.join(', ')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Brand Identity</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Values:</span> {formData.brand_values?.join(', ')}</p>
              <p><span className="font-medium">Industry Terms:</span> {formData.industry_terms?.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Primary:</span> {formData.audience?.primary}</p>
              <p><span className="font-medium">Pain Points:</span> {formData.audience?.pain_points?.join(', ')}</p>
              <p><span className="font-medium">Goals:</span> {formData.audience?.goals?.join(', ')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Things to Avoid</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Terms:</span> {formData.avoid?.terms?.join(', ')}</p>
              <p><span className="font-medium">Phrases:</span> {formData.avoid?.phrases?.join(', ')}</p>
              <p><span className="font-medium">Topics:</span> {formData.avoid?.topics?.join(', ')}</p>
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active || false}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="ml-2 text-sm text-gray-700">Set as active brand voice</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            {currentStep !== 'content' && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Edit Brand Voice' : 'Create New Brand Voice'}
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          <div className="flex justify-end space-x-3 p-6 border-t">
            {currentStep !== 'generating' && (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : 
                   currentStep === 'review' ? "Finish" : "Next"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 