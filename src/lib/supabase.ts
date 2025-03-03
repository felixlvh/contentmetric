// Types for our Supabase tables
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define the ExampleContent type for brand voices
export type ExampleContent = {
  id: string;
  type: 'text' | 'url' | 'file';
  content: string;
  metadata?: {
    filename?: string;
    filesize?: number;
    url?: string;
    title?: string;
  };
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          content: Json;
          user_id: string;
          template_id: string | null;
          brand_voice_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: Json;
          user_id: string;
          template_id?: string | null;
          brand_voice_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: Json;
          user_id?: string;
          template_id?: string | null;
          brand_voice_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          structure: Json;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          structure: Json;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          structure?: Json;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brand_voices: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          tone: string;
          style: string;
          personality: string | null;
          audience: string | null;
          examples: string[] | null;
          avoid: string | null;
          is_active: boolean;
          example_content: ExampleContent[] | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          tone: string;
          style: string;
          personality?: string | null;
          audience?: string | null;
          examples?: string[] | null;
          avoid?: string | null;
          is_active?: boolean;
          example_content?: ExampleContent[] | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          tone?: string;
          style?: string;
          personality?: string | null;
          audience?: string | null;
          examples?: string[] | null;
          avoid?: string | null;
          is_active?: boolean;
          example_content?: ExampleContent[] | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Client-side Supabase client for Browser Components
export const createClientComponentClient = async () => {
  const { createClient } = await import('@/utils/supabase/client');
  return createClient();
};

// Server-side Supabase client for Server Components
export const createServerComponentClient = async () => {
  const { createClient } = await import('@/utils/supabase/server');
  return createClient();
}; 