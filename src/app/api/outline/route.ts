import { NextResponse } from 'next/server';
import { getBlogCapability } from '@/lib/agent/capabilities/blog';
import { getContentTypeConfig } from '@/lib/agent/core/config';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { topic, tone = 'professional' } = body;
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Get the blog capability
    const blogCapability = getBlogCapability();
    
    // Create the prompt for outline generation
    const outlinePrompt = `Create a detailed, comprehensive outline for a blog post about "${topic}". Include an introduction, at least 5 main sections with subsections, and a conclusion. Format with Markdown headings and bullet points.`;
    
    // Get configuration for outlines from centralized config
    const config = getContentTypeConfig('Outline');
    
    // Execute the capability with model specification
    const result = await blogCapability.execute(outlinePrompt, { 
      tone,
      model: config.model,
      temperature: config.temperature
    });
    
    // Return the generated outline
    return NextResponse.json({
      outline: result.content
    });
    
  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
} 