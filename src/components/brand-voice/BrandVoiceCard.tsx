'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { BrandVoice } from '@/types/brand-voice';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BrandVoiceCardProps {
  brandVoice: BrandVoice;
  onEdit: (brandVoice: BrandVoice) => void;
  onDelete: (brandVoice: BrandVoice) => void;
  onSetActive: (brandVoice: BrandVoice) => void;
}

export default function BrandVoiceCard({
  brandVoice,
  onEdit,
  onDelete,
  onSetActive,
}: BrandVoiceCardProps) {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(brandVoice.name);
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameEditContainerRef = useRef<HTMLDivElement>(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  // Add click outside listener to save when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isEditingName &&
        nameEditContainerRef.current &&
        !nameEditContainerRef.current.contains(event.target as Node)
      ) {
        saveName();
      }
    }

    // Add event listener when editing
    if (isEditingName) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingName, nameValue]);

  // Helper function to ensure we're working with arrays and handle string formats
  const ensureArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    
    // If it's already an array, return it
    if (Array.isArray(value)) return value;
    
    // Check if the string looks like a JSON array (starts with [ and ends with ])
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        // Try to parse it as JSON
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // If parsing fails, continue with other methods
      }
    }
    
    // Check if it's a comma-separated string with quotes
    if (value.includes(',') && (value.includes('"') || value.includes("'"))) {
      // Split by commas, then clean up quotes and trim whitespace
      return value
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''));
    }
    
    // If it's a simple comma-separated string
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim());
    }
    
    // If it's just a single string
    return [value];
  };

  // Parse audience data which could be in various formats
  const parseAudience = () => {
    // If audience is a string, try to parse it as JSON
    if (typeof brandVoice.audience === 'string') {
      try {
        // Check if it's a JSON string
        if (brandVoice.audience.startsWith('{') && brandVoice.audience.endsWith('}')) {
          const audienceObj = JSON.parse(brandVoice.audience);
          return {
            primary: audienceObj.primary ? [audienceObj.primary] : [],
            pain_points: Array.isArray(audienceObj.pain_points) 
              ? audienceObj.pain_points 
              : audienceObj.pain_points 
                ? [audienceObj.pain_points] 
                : [],
            goals: Array.isArray(audienceObj.goals) 
              ? audienceObj.goals 
              : audienceObj.goals 
                ? [audienceObj.goals] 
                : []
          };
        }
        // If it's not a JSON object, treat it as a simple string
        return {
          primary: [brandVoice.audience],
          pain_points: [],
          goals: []
        };
      } catch {
        // If parsing fails, treat it as a simple string
        return {
          primary: [brandVoice.audience],
          pain_points: [],
          goals: []
        };
      }
    }
    
    // If audience is already an object
    if (typeof brandVoice.audience === 'object' && brandVoice.audience !== null) {
      return {
        primary: brandVoice.audience.primary_demographics 
          ? ensureArray(brandVoice.audience.primary_demographics)
          : [],
        pain_points: brandVoice.audience.pain_points || [],
        goals: brandVoice.audience.goals || []
      };
    }
    
    // Default empty structure
    return {
      primary: [],
      pain_points: [],
      goals: []
    };
  };

  // Convert potential string values to arrays
  const toneArray = ensureArray(brandVoice.tone);
  const styleArray = ensureArray(brandVoice.style);
  const personalityArray = ensureArray(brandVoice.personality);
  
  // Parse audience data
  const audience = parseAudience();

  // Specific tag style for tone tags
  const toneTagStyle = "inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";

  // Specific tag style for style tags
  const styleTagStyle ="inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";

  // Specific tag style for personality tags
  const personalityTagStyle = "inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";

  // Specific tag style for primary audience tags
  const primaryTagStyle ="inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";

  // Specific tag style for pain point tags
  const painPointTagStyle ="inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";

  // Specific tag style for goal tags
  const goalTagStyle ="inline-flex items-center rounded-md bg-white-20 px-2 py-1 text-xs font-small text-gey-100 ring-1 ring-inset ring-great-600/20";
  // Function to save the updated name
  const saveName = async () => {
    if (!nameValue.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    // If the name hasn't changed, just exit edit mode
    if (nameValue === brandVoice.name) {
      setIsEditingName(false);
      setNameError(null);
      return;
    }

    try {
      setIsSaving(true);
      setNameError(null);
      
      const response = await fetch(`/api/brand-voice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: brandVoice.id,
          name: nameValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand voice name');
      }

      setIsEditingName(false);
      
      // Update the local state with the new name
      brandVoice.name = nameValue;
    } catch (error) {
      setNameError(error instanceof Error ? error.message : 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle keyboard events for the name input
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      setNameValue(brandVoice.name);
      setIsEditingName(false);
      setNameError(null);
    }
  };

  const navigateToDetails = () => {
    // Don't navigate if we're editing the name
    if (isEditingName) return;
    router.push(`/brand-voice/${brandVoice.id}`);
  };

  return (
    <div 
      className="overflow-hidden rounded-lg bg-white shadow flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={navigateToDetails}
    >
      <div className="px-4 py-5 sm:p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditingName ? (
              <div className="space-y-1" ref={nameEditContainerRef}>
                <div className="flex items-center">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    className="text-lg font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                    disabled={isSaving}
                  />
                  <div className="flex ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveName();
                      }}
                      className="p-1 text-green-500 hover:text-green-600"
                      disabled={isSaving}
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNameValue(brandVoice.name);
                        setIsEditingName(false);
                        setNameError(null);
                      }}
                      className="p-1 text-red-500 hover:text-red-600"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {nameError && (
                  <p className="text-xs text-red-500">{nameError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center group">
                <h3 className="text-lg font-semibold text-gray-900">{brandVoice.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                  className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity"
                  title="Edit name"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            )}
            {brandVoice.description && (
              <p className="mt-1 text-sm text-gray-500">{brandVoice.description}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(brandVoice);
              }}
              className="text-gray-500 hover:text-blue-500"
              title="Edit all details"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(brandVoice);
              }}
              className="text-gray-500 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Tone</h4>
            <div className="flex flex-wrap gap-1">
              {toneArray.length > 0 ? (
                toneArray.map((item, index) => (
                  <span
                    key={index}
                    className={toneTagStyle}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Style</h4>
            <div className="flex flex-wrap gap-1">
              {styleArray.length > 0 ? (
                styleArray.map((item, index) => (
                  <span
                    key={index}
                    className={styleTagStyle}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Personality</h4>
            <div className="flex flex-wrap gap-1">
              {personalityArray.length > 0 ? (
                personalityArray.map((item, index) => (
                  <span
                    key={index}
                    className={personalityTagStyle}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Audience</h4>
            
            {/* Primary Audience */}
            {audience.primary.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-1">Primary:</span>
                <div className="flex flex-wrap gap-1">
                  {audience.primary.map((item, index) => (
                    <span
                      key={`primary-${index}`}
                      className={primaryTagStyle}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pain Points */}
            {audience.pain_points.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-1">Pain Points:</span>
                <div className="flex flex-wrap gap-1">
                  {audience.pain_points.map((item: string, index: number) => (
                    <span
                      key={`pain-${index}`}
                      className={painPointTagStyle}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Goals */}
            {audience.goals.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">Goals:</span>
                <div className="flex flex-wrap gap-1">
                  {audience.goals.map((item: string, index: number) => (
                    <span
                      key={`goal-${index}`}
                      className={goalTagStyle}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {audience.primary.length === 0 && audience.pain_points.length === 0 && audience.goals.length === 0 && (
              <span className="text-sm text-gray-500">Not specified</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center mt-auto">
        <div>
          {brandVoice.is_active ? (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <Check className="h-3 w-3 mr-1" />
              Active
            </span>
          ) : (
            <button
              onClick={() => onSetActive(brandVoice)}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 ring-1 ring-inset ring-gray-500/10"
            >
              Set as Active
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">{formatDate(brandVoice.created_at)}</span>
      </div>
    </div>
  );
} 