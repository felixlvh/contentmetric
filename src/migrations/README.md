# Database Migrations

This directory contains SQL migration files for the ContentMetric application.

## How to Run Migrations

### Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

### Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to the project root
cd /path/to/contentmetric

# Run the migration
supabase db execute --file ./src/migrations/add_brand_voice_id_to_ai_generations.sql
```

## Migration Files

- `add_brand_voice_id_to_ai_generations.sql`: Adds the `brand_voice_id`, `style_guide_id`, and `visual_guidelines_id` columns to the `ai_generations` table to support linking AI-generated content with brand voices, style guides, and visual guidelines.

## Troubleshooting

If you encounter the error `Could not find the 'brand_voice_id' column of 'ai_generations' in the schema cache`, run the following SQL to refresh the PostgREST schema cache:

```sql
NOTIFY pgrst, 'reload schema';
``` 