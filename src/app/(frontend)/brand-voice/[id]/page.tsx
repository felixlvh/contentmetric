'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Settings, 
  Play, 
  Trash2, 
  Plus, 
  Edit3, 
  Save, 
  Undo2,
  X,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { BrandVoice } from '@/types/brand-voice';
import Link from 'next/link';

interface Excerpt {
  id: string;
  content: string;
  characterCount: number;
  maxCharacters: number;
}

export default function BrandVoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [brandVoice, setBrandVoice] = useState<BrandVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [enableExcerpts, setEnableExcerpts] = useState(true);
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [originalDescription, setOriginalDescription] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewContentType, setPreviewContentType] = useState('Blog Post');
  const [previewTopic, setPreviewTopic] = useState('');
  const [previewOutline, setPreviewOutline] = useState('');
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [isTopicExpanded, setIsTopicExpanded] = useState(true);
  const [isOutlineExpanded, setIsOutlineExpanded] = useState(true);
  const [isTopicFilled, setIsTopicFilled] = useState(false);
  const [isOutlineFilled, setIsOutlineFilled] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContentWithBrandVoice, setGeneratedContentWithBrandVoice] = useState<string | null>(null);
  const [generatedContentWithoutBrandVoice, setGeneratedContentWithoutBrandVoice] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (params && params.id) {
      fetchBrandVoice(params.id as string);
    }
  }, [params]);

  const fetchBrandVoice = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/brand-voice/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        // Check if it's an authentication error
        if (response.status === 401 || (errorData.error && errorData.error.includes('Unauthorized'))) {
          console.error('Authentication error:', errorData.error);
          setError('You need to be logged in to view this brand voice. Please log in and try again.');
          throw new Error('Authentication error: ' + errorData.error);
        }
        
        // Handle other errors
        console.error('Error fetching brand voice:', errorData.error);
        setError(errorData.error || 'Failed to fetch brand voice details');
        throw new Error(errorData.error || 'Failed to fetch brand voice details');
      }
      
      const data = await response.json();
      setBrandVoice(data);
      setDescription(data.description || '');
      setOriginalDescription(data.description || '');
      
      // Mock excerpts for now - in a real app, these would come from the API
      setExcerpts([
        {
          id: '1',
          content: "Unparalleled luxury awaits at Singapore's top luxury hotel. Experience world-class dining, entertainment and stunning views at the leading integrated resort.",
          characterCount: 157,
          maxCharacters: 400
        },
        {
          id: '2',
          content: 'Seen from the outside, Marina Bay Sands floats above the Singapore skyline, unchanged and timeless. But within, a transformation has blossomed.',
          characterCount: 143,
          maxCharacters: 400
        },
        {
          id: '3',
          content: 'Embark on an epicurean voyage through global cultures and cuisines, each crafted with culinary precision and the finest ingredients.',
          characterCount: 132,
          maxCharacters: 400
        },
        {
          id: '4',
          content: 'Wander through immersive exhibitions. Find world-class theatre shows and concerts. Discover our year-round calendar of festivals and events that make Marina Bay Sands a vibrant destination.',
          characterCount: 206,
          maxCharacters: 400
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDescription = async () => {
    if (!brandVoice) return;
    
    try {
      const response = await fetch(`/api/brand-voice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: brandVoice.id,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand voice description');
      }

      setIsEditingDescription(false);
      setOriginalDescription(description);
      
      // Update the local state
      setBrandVoice({
        ...brandVoice,
        description: description
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update description');
    }
  };

  const cancelDescriptionEdit = () => {
    setDescription(originalDescription);
    setIsEditingDescription(false);
  };

  const deleteExcerpt = (id: string) => {
    setExcerpts(excerpts.filter(excerpt => excerpt.id !== id));
  };

  // Preview modal handlers
  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const generatePreview = () => {
    // In a real implementation, this would call an API to generate content
    console.log('Generating preview with:', {
      contentType: previewContentType,
      topic: previewTopic,
      outline: previewOutline
    });
    // For now, we'll just keep the modal open to show the UI
  };

  // Toggle content type dropdown
  const toggleContentTypeDropdown = () => {
    setShowContentTypeDropdown(!showContentTypeDropdown);
  };

  // Select content type
  const selectContentType = (type: string) => {
    setPreviewContentType(type);
    setShowContentTypeDropdown(false);
  };

  // Toggle topic section visibility
  const toggleTopicSection = () => {
    if (isTopicExpanded) {
      // If already open, just close it
      setIsTopicExpanded(false);
    } else {
      // If closed, open it and close the other section
      setIsTopicExpanded(true);
      setIsOutlineExpanded(false);
    }
  };

  // Toggle outline section visibility
  const toggleOutlineSection = () => {
    if (isOutlineExpanded) {
      // If already open, just close it
      setIsOutlineExpanded(false);
    } else {
      // If closed, open it and close the other section
      setIsOutlineExpanded(true);
      setIsTopicExpanded(false);
    }
  };

  // Set topic and switch to outline section
  const setTopicAndSwitchToOutline = (topic: string) => {
    setPreviewTopic(topic);
    setIsTopicExpanded(false);
    setIsOutlineExpanded(true);
  };

  // Generate outline based on topic
  const generateOutline = async () => {
    if (!previewTopic.trim()) {
      return; // Don't generate if no topic
    }
    
    try {
      // Set loading state
      setIsGeneratingOutline(true);
      
      // Call the API endpoint instead of using the capability directly
      const response = await fetch('/api/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: previewTopic,
          tone: 'professional',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }
      
      const data = await response.json();
      
      // Update the outline with the generated content
      setPreviewOutline(data.outline);
    } catch (error) {
      console.error('Error generating outline:', error);
      // Fallback to a simple outline if the API call fails
      const topicTitle = previewTopic.charAt(0).toUpperCase() + previewTopic.slice(1);
      setPreviewOutline(`# ${topicTitle}: A Comprehensive Guide\n\n## Introduction\n- Key points about ${previewTopic}\n\n## Main Sections\n- Important aspect 1\n- Important aspect 2\n- Important aspect 3\n\n## Conclusion\n- Summary and next steps`);
    } finally {
      // Clear loading state
      setIsGeneratingOutline(false);
    }
  };

  // Update topic filled state when topic changes
  useEffect(() => {
    setIsTopicFilled(previewTopic.trim().length > 0);
  }, [previewTopic]);

  // Update outline filled state when outline changes
  useEffect(() => {
    setIsOutlineFilled(previewOutline.trim().length > 0);
  }, [previewOutline]);

  // Generate random topics based on historic memory
  const getRandomTopics = () => {
    // This would ideally come from an API or database of previously used topics
    const historicTopics = [
      "Benefits of Meditation",
      "How to Start a Blog",
      "Effective Time Management Tips",
      "Digital Marketing Strategies for 2023",
      "Sustainable Living Practices",
      "Remote Work Best Practices",
      "Healthy Eating Habits",
      "Financial Planning for Beginners",
      "Creative Writing Techniques",
      "Home Office Setup Ideas"
    ];
    
    // Shuffle and take the first 3
    return [...historicTopics]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  // Get random topics on component mount
  const [randomTopics, setRandomTopics] = useState<string[]>([]);
  
  useEffect(() => {
    setRandomTopics(getRandomTopics());
  }, []);

  // Generate content with and without brand voice
  const generateContent = async () => {
    if (!previewTopic.trim() || !params?.id) {
      return; // Don't generate if no topic or no brand voice ID
    }
    
    // Reset any previous errors
    setGenerationError(null);
    
    try {
      // Set loading state
      setIsGeneratingContent(true);
      
      // Check if we have the brand voice data first
      if (!brandVoice) {
        try {
          // Try to fetch the brand voice again
          await fetchBrandVoice(params.id as string);
        } catch (fetchError) {
          console.error('Error fetching brand voice:', fetchError);
          throw new Error('Could not fetch brand voice details. Please try refreshing the page.');
        }
        
        // If still no brand voice after fetching, throw error
        if (!brandVoice) {
          throw new Error('Brand voice details not available. Please try refreshing the page.');
        }
      }
      
      // Generate content WITH brand voice
      const withBrandVoiceResponse = await fetch('/api/brand-voice-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandVoiceId: params.id,
          contentType: previewContentType,
          topic: previewTopic,
          outline: previewOutline,
          withBrandVoice: true
        }),
      });
      
      let withBrandVoiceData;
      
      if (!withBrandVoiceResponse.ok) {
        const errorData = await withBrandVoiceResponse.json().catch(() => ({ error: 'Unknown error' }));
        
        // If it's an authentication error, try to refresh the page
        if (errorData.error && errorData.error.includes('Authentication')) {
          throw new Error('Authentication error. Please try refreshing the page and logging in again.');
        }
        
        throw new Error(errorData.error || 'Failed to generate content with brand voice');
      }
      
      try {
        withBrandVoiceData = await withBrandVoiceResponse.json();
      } catch (parseError) {
        console.error('Error parsing brand voice response:', parseError);
        throw new Error('Failed to parse response from server');
      }
      
      // Generate content WITHOUT brand voice
      const withoutBrandVoiceResponse = await fetch('/api/brand-voice-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandVoiceId: params.id,
          contentType: previewContentType,
          topic: previewTopic,
          outline: previewOutline,
          withBrandVoice: false
        }),
      });
      
      let withoutBrandVoiceData;
      
      if (!withoutBrandVoiceResponse.ok) {
        const errorData = await withoutBrandVoiceResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate content without brand voice');
      }
      
      try {
        withoutBrandVoiceData = await withoutBrandVoiceResponse.json();
      } catch (parseError) {
        console.error('Error parsing response without brand voice:', parseError);
        throw new Error('Failed to parse response from server');
      }
      
      // Update the state with generated content
      setGeneratedContentWithBrandVoice(withBrandVoiceData.content);
      setGeneratedContentWithoutBrandVoice(withoutBrandVoiceData.content);
      
    } catch (error) {
      console.error('Error generating content:', error);
      // Set error state or show error message
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      // Clear loading state
      setIsGeneratingContent(false);
    }
  };

  // Add this near where you render the preview modal content
  const renderPreviewContent = () => {
    if (isGeneratingContent) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (generationError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">Generation Error</p>
          <p>{generationError}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">With Brand Voice</h3>
          <div className="prose max-w-none">
            {generatedContentWithBrandVoice ? (
              <div dangerouslySetInnerHTML={{ __html: generatedContentWithBrandVoice }} />
            ) : (
              <p className="text-gray-500">No content generated yet</p>
            )}
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Without Brand Voice</h3>
          <div className="prose max-w-none">
            {generatedContentWithoutBrandVoice ? (
              <div dangerouslySetInnerHTML={{ __html: generatedContentWithoutBrandVoice }} />
            ) : (
              <p className="text-gray-500">No content generated yet</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !brandVoice) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error || 'Brand voice not found'}</p>
          <button 
            onClick={() => router.push('/brand-voice')}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Return to Brand Voices
          </button>
        </div>
      </div>
    );
  }

  // Helper function to format arrays or strings for display
  const formatTags = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const toneArray = formatTags(brandVoice.tone);
  const styleArray = formatTags(brandVoice.style);
  const personalityArray = formatTags(brandVoice.personality);

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header with breadcrumb and actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/brand-voice" className="text-gray-600 hover:text-gray-900">
            Brand Voice
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Edit your voice</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-sm flex items-center">
            <Undo2 className="h-4 w-4 mr-1" />
            Undo all
          </button>
          
          <button 
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
            onClick={openPreviewModal}
          >
            <Play className="h-4 w-4 mr-1" />
            Preview Brand Voice
          </button>
          
          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center">
            <Save className="h-4 w-4 mr-1" />
            Save changes
          </button>
          
          <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Brand voice name and metadata */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{brandVoice.name}</h1>
        
        <div className="flex flex-wrap gap-y-4 text-sm text-gray-600">
          <div className="w-full sm:w-1/3 flex items-center">
            <span className="text-gray-500 mr-2">Best used for:</span>
            <button className="text-indigo-600 hover:text-indigo-800">Add Tags</button>
          </div>
          
          <div className="w-full sm:w-1/3 flex items-center">
            <span className="text-gray-500 mr-2">Visibility:</span>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>Public</span>
            </div>
          </div>
          
          <div className="w-full sm:w-1/3 flex items-center">
            <span className="text-gray-500 mr-2">Last updated:</span>
            <span>{new Date(brandVoice.updated_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div className="w-full sm:w-1/3 flex items-center">
            <span className="text-gray-500 mr-2">Created by:</span>
            <span>Support F.</span>
          </div>
        </div>
      </div>
      
      {/* Description section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-sm text-gray-600 mb-4">
          The voice description defines the core characteristics of your brand&apos;s voice. This should be detailed and specific enough for someone unfamiliar with your brand to successfully emulate your voice.
        </p>
        
        <div className="relative border border-gray-200 rounded-lg p-4">
          {isEditingDescription ? (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[200px] p-2 text-gray-800 focus:outline-none resize-none"
                placeholder="Describe your brand voice..."
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{description.length} / 7000</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={cancelDescriptionEdit}
                    className="px-2 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveDescription}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                {description || 'No description provided. Click edit to add one.'}
              </div>
              <button 
                onClick={() => setIsEditingDescription(true)}
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Excerpts section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Excerpts</h2>
          <button 
            className={`px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 text-sm flex items-center ${!enableExcerpts ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!enableExcerpts}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add new excerpt
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Excerpts are 1-2 sentence examples of your voice in action. The more representative these excerpts are, the more accurately Jasper can produce content that feels true to your brand. You can edit, delete or add your own excerpts to improve the quality of your voice.
        </p>
        
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={enableExcerpts}
              onChange={() => setEnableExcerpts(!enableExcerpts)}
              className="form-checkbox h-5 w-5 text-indigo-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable excerpts to improve the accuracy of your voice</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {excerpts.map((excerpt, index) => (
            <div 
              key={excerpt.id} 
              className={`border border-gray-200 rounded-lg overflow-hidden transition-opacity duration-200 ${!enableExcerpts ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Excerpt {index + 1}</h3>
                  <button 
                    onClick={() => deleteExcerpt(excerpt.id)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={!enableExcerpts}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-800">{excerpt.content}</p>
              </div>
              <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-right">
                {excerpt.characterCount} / {excerpt.maxCharacters}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Voice characteristics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Characteristics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tone */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Tone</h3>
            <div className="flex flex-wrap gap-2">
              {toneArray.map((tone, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
                >
                  {tone}
                </span>
              ))}
            </div>
          </div>
          
          {/* Style */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Style</h3>
            <div className="flex flex-wrap gap-2">
              {styleArray.map((style, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
          
          {/* Personality */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Personality</h3>
            <div className="flex flex-wrap gap-2">
              {personalityArray.map((trait, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Brand Voice Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-[80%] h-[80%] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Preview Brand Voice</h2>
              <button 
                onClick={closePreviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto flex-grow text-sm">
              {/* Left column - Input options */}
              <div className="lg:col-span-1 flex flex-col h-full">
                <h3 className="text-base font-medium mb-4">How would you like to test your Brand Voice?</h3>
                
                <div className="space-y-4 flex-grow overflow-auto">
                  {/* Content Type Dropdown */}
                  <div>
                    <div className="relative">
                      <button 
                        className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left"
                        onClick={toggleContentTypeDropdown}
                      >
                        <span>{previewContentType}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {showContentTypeDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                          <button 
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${previewContentType === 'Blog Post' ? 'bg-gray-50 font-medium' : ''}`}
                            onClick={() => selectContentType('Blog Post')}
                          >
                            Blog Post
                          </button>
                          <button 
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${previewContentType === 'LinkedIn Post' ? 'bg-gray-50 font-medium' : ''}`}
                            onClick={() => selectContentType('LinkedIn Post')}
                          >
                            LinkedIn Post
                          </button>
                          <button 
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${previewContentType === 'Product Description' ? 'bg-gray-50 font-medium' : ''}`}
                            onClick={() => selectContentType('Product Description')}
                          >
                            Product Description
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Topic Input with Dropdown */}
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <button 
                      onClick={toggleTopicSection}
                      className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 text-left"
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          {isTopicFilled ? (
                            <div className="ml-0.5 w-3.5 h-3.5 rounded-full border border-green-500 border-dashed bg-green-100"></div>
                          ) : (
                            <div className="ml-0.5 w-3.5 h-3.5 rounded-full border border-dashed border-gray-600"></div>
                          )}
                        </div>
                        <span className="font-medium">Topic</span>
                        {previewTopic && (
                          <span className="ml-2 text-gray-500 truncate max-w-[150px]">
                            {previewTopic}
                          </span>
                        )}
                      </div>
                      {isTopicExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isTopicExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-3">
                        <p className="text-xs text-gray-600 mb-2">What is the topic of your post?</p>
                        <input
                          type="text"
                          value={previewTopic}
                          onChange={(e) => setPreviewTopic(e.target.value)}
                          placeholder="Enter a topic"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-1 text-sm"
                        />
                        <div className="flex justify-end text-xs text-gray-500 mb-2">
                          <span>{previewTopic.length} / 1000</span>
                        </div>
                        
                        {/* Quick Picks Section - Always visible */}
                        <div className="mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center mb-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M13.3332 8.00004L7.33317 14.0001L5.6665 12.3334L9.99984 8.00004L5.6665 3.66671L7.33317 2.00004L13.3332 8.00004Z" fill="#6366F1"/>
                                <path d="M10.6668 8.00004L4.6668 14.0001L3 12.3334L7.33333 8.00004L3 3.66671L4.6668 2.00004L10.6668 8.00004Z" fill="#6366F1" fillOpacity="0.3"/>
                              </svg>
                              <span className="text-xs text-gray-500">Quick picks</span>
                            </div>
                            {randomTopics.map((topic, index) => (
                              <button 
                                key={index}
                                className="w-full text-left px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs"
                                onClick={() => setTopicAndSwitchToOutline(topic)}
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Outline Input with Dropdown */}
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <button 
                      onClick={toggleOutlineSection}
                      className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 text-left"
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          {isOutlineFilled ? (
                            <div className="ml-0.5 w-3.5 h-3.5 rounded-full border border-green-500 border-dashed bg-green-100"></div>
                          ) : (
                            <div className="ml-0.5 w-3.5 h-3.5 rounded-full border border-dashed border-gray-600"></div>
                          )}
                        </div>
                        <span className="font-medium">Outline</span>
                      </div>
                      {isOutlineExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOutlineExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-3">
                        <p className="text-xs text-gray-600 mb-2">What is the outline of your post?</p>
                        {/* Show loading indicator during outline generation */}
                        {isGeneratingOutline ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            <span className="ml-2 text-sm text-gray-600">Generating outline...</span>
                          </div>
                        ) : (
                          <textarea
                            value={previewOutline}
                            onChange={(e) => setPreviewOutline(e.target.value)}
                            placeholder="Enter or generate an outline for your content..."
                            className="w-full h-[400px] p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )}
                        
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={generateOutline}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 text-xs"
                            disabled={!previewTopic.trim()}
                          >
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Generate response
                          </button>
                          <div className="whitespace-nowrap ml-auto mr-3">
                            <span className="flex gap-1 items-center pl-3 text-caption whitespace-pre-line">
                              <span data-testid="input-message" className="text-gray-600 text-xs">
                                {previewOutline.length} / 10000
                              </span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                          <button 
                            onClick={() => {
                              setIsOutlineExpanded(false);
                              // Wait for animation to complete before proceeding
                              setTimeout(() => {
                                generatePreview();
                              }, 300);
                            }}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generate button at the bottom of the left column */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={generateContent}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium flex items-center justify-center"
                    disabled={isGeneratingContent || !previewTopic.trim()}
                  >
                    {isGeneratingContent ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right column - Preview comparison */}
              <div className="lg:col-span-2">
                {renderPreviewContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 