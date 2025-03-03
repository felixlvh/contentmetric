-- Add brand_voice_id column to ai_generations table
ALTER TABLE ai_generations 
ADD COLUMN IF NOT EXISTS brand_voice_id UUID REFERENCES brand_voices(id);

-- Add style_guide_id column if it doesn't exist
ALTER TABLE ai_generations 
ADD COLUMN IF NOT EXISTS style_guide_id UUID REFERENCES style_guides(id);

-- Add visual_guidelines_id column if it doesn't exist
ALTER TABLE ai_generations 
ADD COLUMN IF NOT EXISTS visual_guidelines_id UUID REFERENCES visual_guidelines(id);

-- Update the PostgREST schema cache
NOTIFY pgrst, 'reload schema'; 