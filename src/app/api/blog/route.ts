import { NextResponse } from 'next/server';
import { getBlogCapability } from '@/lib/agent/capabilities/blog';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      topic, 
      tone = 'professional',
      style = 'storyteller',
      wordCount = 5111, // Default to the requested word count
      keywords = []
    } = body;
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Get the blog capability
    const blogCapability = getBlogCapability();
    
    // Create the prompt for blog generation
    let blogPrompt = `Write a comprehensive, engaging blog post about "${topic}".`;
    
    // Add keywords if provided
    if (keywords.length > 0) {
      blogPrompt += ` Include the following keywords naturally throughout the content: ${keywords.join(', ')}.`;
    }
    
    // Execute the capability with storyteller style and high word count
    const result = await blogCapability.execute(blogPrompt, { 
      tone, 
      style, 
      wordCount 
    });
    
    // Return the generated blog content
    return NextResponse.json({
      content: result.content,
      wordCount: result.content.split(/\s+/).length,
      topic
    });
    
  } catch (error) {
    console.error('Error generating blog content:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog content' },
      { status: 500 }
    );
  }
} 