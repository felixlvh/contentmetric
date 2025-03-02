import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { AIModel } from '@/lib/agent/core/config';

// Define types for the request body
interface ContentTypeConfig {
  model: AIModel;
  temperature: number;
  maxTokens: number;
}

interface CapabilityConfig {
  model: AIModel;
  temperature: number;
}

interface ConfigPayload {
  contentTypes: Record<string, ContentTypeConfig>;
  capabilities: Record<string, CapabilityConfig>;
}

// In-memory cache for configurations
// In a production environment, you would use a database
let cachedConfig: ConfigPayload | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for updates and GET for retrieval
  if (req.method === 'GET') {
    return handleGetConfig(req, res);
  } else if (req.method === 'POST') {
    return handleUpdateConfig(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

/**
 * Handle GET requests to retrieve the current configuration
 */
async function handleGetConfig(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // If we have a cached config, return it
    if (cachedConfig) {
      return res.status(200).json(cachedConfig);
    }
    
    // Otherwise, try to load from the JSON file
    const configFilePath = path.join(process.cwd(), 'config/ai-config.json');
    
    if (fs.existsSync(configFilePath)) {
      const fileContent = fs.readFileSync(configFilePath, 'utf8');
      const config = JSON.parse(fileContent) as ConfigPayload;
      
      // Cache the config
      cachedConfig = config;
      
      return res.status(200).json(config);
    }
    
    // If no config exists, return a 404
    return res.status(404).json({ message: 'Configuration not found' });
  } catch (error) {
    console.error('Error retrieving configuration:', error);
    return res.status(500).json({ 
      message: 'Failed to retrieve configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Handle POST requests to update the configuration
 */
async function handleUpdateConfig(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = req.body as ConfigPayload;
    
    // Validate the payload
    if (!payload || !payload.contentTypes || !payload.capabilities) {
      return res.status(400).json({ message: 'Invalid configuration data' });
    }
    
    // In a production environment, you would:
    // 1. Validate the user has permission to update the configuration
    // 2. Store the configuration in a database
    
    // For this example, we'll store the configuration in a JSON file
    const configDir = path.join(process.cwd(), 'config');
    const configFilePath = path.join(configDir, 'ai-config.json');
    
    // Create the config directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Write the configuration to the file
    fs.writeFileSync(configFilePath, JSON.stringify(payload, null, 2), 'utf8');
    
    // Update the in-memory cache
    cachedConfig = payload;
    
    // Return success response
    return res.status(200).json({ 
      message: 'Configuration saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    return res.status(500).json({ 
      message: 'Failed to save configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 