export interface BrandVoice {
  id: string;
  name: string;
  description?: string;
  
  // Voice Characteristics
  formality_level: 'very_formal' | 'formal' | 'neutral' | 'casual' | 'very_casual';
  technical_level: 'expert' | 'technical' | 'intermediate' | 'beginner' | 'layman';
  
  // Core Attributes
  tone: string[] | string;
  style: string[] | string;
  personality: string[] | string;
  
  // Brand Identity
  brand_values: string[];
  industry_terms: string[];
  communication_goals: string[];
  
  // Content Types
  content_types?: {
    blog?: {
      preferred_formats: string[];
      style_adjustments: string[];
    };
    social?: {
      platforms: string[];
      tone_adjustments: string[];
    };
    email?: {
      types: string[];
      formality_adjustments: string[];
    };
  };
  
  // Audience & Context
  audience: {
    primary_demographics: string[] | string;
    secondary_demographics: string[] | string;
    pain_points: string[];
    goals: string[];
  } | string;
  
  // Guidelines
  avoid: {
    terms: string[];
    phrases: string[];
    topics: string[];
    style_elements: string[];
  };
  
  // Example Content
  example_content?: {
    text: string;
    type: string;
    analysis?: {
      tone_match: number;
      style_match: number;
      personality_match: number;
      suggestions: string[];
    };
  }[];
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
} 