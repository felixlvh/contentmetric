import OpenAI from 'openai';

// Get the API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Log a warning if the API key is missing, but don't throw an error yet
if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not defined in environment variables. OpenAI API calls will fail.');
  console.warn('Please make sure you have added OPENAI_API_KEY to your .env.local file and restarted the server.');
}

// Create the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-for-initialization', // Use a dummy key to avoid initialization errors
});

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OpenAICallParams = {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
};

export async function callOpenAI({
  messages,
  temperature = 0.7,
  max_tokens,
  model = 'gpt-4-turbo-preview',
}: OpenAICallParams) {
  try {
    console.log(`Calling OpenAI API with model: ${model}`);
    console.log(`Number of messages: ${messages.length}`);
    
    // Check for API key before making the API call
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY is not defined in environment variables. ' +
        'Please add it to your .env.local file and restart the server.'
      );
    }
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    console.log('OpenAI API response received');
    console.log('Response tokens:', response.usage?.total_tokens || 'unknown');
    
    if (!response.choices || response.choices.length === 0) {
      throw new Error('OpenAI API returned no choices');
    }
    
    return {
      content: response.choices[0].message.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check for specific OpenAI error types
      if ('status' in error && typeof error.status === 'number') {
        console.error('OpenAI API status code:', error.status);
      }
      
      if ('code' in error && typeof error.code === 'string') {
        console.error('OpenAI error code:', error.code);
      }
    }
    
    throw new Error(`Failed to generate content from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 