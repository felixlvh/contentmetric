# Brand Voice Management

This feature allows users to create, manage, and apply brand voices to their content. Similar to Jasper.ai's brand voice feature, it helps maintain consistent tone and style across all content.

## Features

- Create and manage multiple brand voices
- Set one brand voice as active
- Analyze content against a brand voice for compliance
- Get detailed feedback on adherence, strengths, and areas for improvement

## Components

### Database

The `brand_voices` table in Supabase stores all brand voice data with the following structure:

```sql
CREATE TABLE brand_voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  tone TEXT NOT NULL,
  style TEXT NOT NULL,
  personality TEXT,
  audience TEXT,
  examples TEXT[] DEFAULT '{}',
  avoid TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

- `GET /api/brand-voice` - Get all brand voices or a specific one by ID
- `POST /api/brand-voice` - Create a new brand voice
- `PUT /api/brand-voice` - Update an existing brand voice
- `DELETE /api/brand-voice` - Delete a brand voice
- `PATCH /api/brand-voice/active` - Set a brand voice as active
- `POST /api/brand-voice/analyze` - Analyze content against a brand voice

### UI Components

- `BrandVoiceForm` - Form for creating and editing brand voices
- `BrandVoiceAnalyzer` - Component for analyzing content against a brand voice
- `BrandVoicePage` - Main page component for managing brand voices

## Usage

### Creating a Brand Voice

1. Navigate to the Brand Voice page
2. Click "Create New Voice"
3. Fill in the required fields:
   - Name: A descriptive name for the brand voice
   - Tone: The emotional quality of the voice (e.g., formal, conversational)
   - Style: How content is structured (e.g., concise, detailed)
4. Optional fields:
   - Description: A summary of the brand voice
   - Personality: Character traits of the brand
   - Audience: Who the content is for
   - Examples: Sample sentences demonstrating the voice
   - Things to Avoid: Elements to exclude from content
   - Set as Active: Make this the default brand voice

### Analyzing Content

1. Navigate to the Brand Voice page
2. Scroll down to the Brand Voice Analyzer
3. Select a brand voice (or use the active one)
4. Paste your content in the text area
5. Click "Analyze Content"
6. Review the results:
   - Adherence Score: How well the content matches the brand voice
   - Tone and Style Match: Whether these elements align
   - Strengths: What works well
   - Violations: Where the content doesn't match
   - Suggestions: How to improve

## Implementation Details

The brand voice analyzer uses OpenAI's GPT-4o model to evaluate content against the defined brand voice guidelines. The analysis is performed server-side to protect API keys and ensure consistent results.

## Future Enhancements

- Integration with the content editor for real-time analysis
- Brand voice templates for common industries
- AI-assisted brand voice creation based on existing content
- Export/import functionality for sharing brand voices across teams 