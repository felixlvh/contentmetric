-- Check if the brand_voices table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'brand_voices') THEN
    -- Add missing columns if they don't exist
    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'personality') THEN
        ALTER TABLE brand_voices ADD COLUMN personality TEXT;
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;

    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'audience') THEN
        ALTER TABLE brand_voices ADD COLUMN audience TEXT;
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;

    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'examples') THEN
        ALTER TABLE brand_voices ADD COLUMN examples TEXT[] DEFAULT '{}';
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;

    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'avoid') THEN
        ALTER TABLE brand_voices ADD COLUMN avoid TEXT;
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;

    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'is_active') THEN
        ALTER TABLE brand_voices ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;

    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'brand_voices' AND column_name = 'example_content') THEN
        ALTER TABLE brand_voices ADD COLUMN example_content JSONB DEFAULT '[]';
      END IF;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  ELSE
    -- Create the brand_voices table if it doesn't exist
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
      example_content JSONB DEFAULT '[]',
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create index on user_id for faster queries
    CREATE INDEX brand_voices_user_id_idx ON brand_voices(user_id);
    
    -- Create RLS policies
    ALTER TABLE brand_voices ENABLE ROW LEVEL SECURITY;
    
    -- Policy for users to see only their own brand voices
    CREATE POLICY brand_voices_select_policy ON brand_voices
      FOR SELECT USING (auth.uid() = user_id);
      
    -- Policy for users to insert their own brand voices
    CREATE POLICY brand_voices_insert_policy ON brand_voices
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
    -- Policy for users to update their own brand voices
    CREATE POLICY brand_voices_update_policy ON brand_voices
      FOR UPDATE USING (auth.uid() = user_id);
      
    -- Policy for users to delete their own brand voices
    CREATE POLICY brand_voices_delete_policy ON brand_voices
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$; 