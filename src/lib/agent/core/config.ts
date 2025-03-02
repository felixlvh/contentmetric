/**
 * AI Model Configuration
 * 
 * This file defines the central configuration for AI models and capabilities
 * used throughout the application.
 */

/**
 * Available AI models
 */
export enum AIModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT4Turbo = 'gpt-4-turbo',
  GPT4OMini = 'gpt-4o-mini-2024-07-18',
  GPT4 = 'gpt-4',
}

/**
 * Default model to use when not specified
 */
export const DEFAULT_MODEL = AIModel.GPT4OMini;

/**
 * Configuration for content types
 */
export interface ContentTypeConfig {
  model: AIModel;
  temperature: number;
  maxTokens: number;
}

/**
 * Configuration for capabilities
 */
export interface CapabilityConfig {
  model: AIModel;
  temperature: number;
}

/**
 * Default configurations for different content types
 */
export const contentTypeConfigs: Record<string, ContentTypeConfig> = {
  'Blog Post': {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 2000,
  },
  'LinkedIn Post': {
    model: DEFAULT_MODEL,
    temperature: 0.6,
    maxTokens: 600,
  },
  'Twitter Post': {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 280,
  },
  'Email': {
    model: DEFAULT_MODEL,
    temperature: 0.5,
    maxTokens: 1000,
  },
  'Product Description': {
    model: DEFAULT_MODEL,
    temperature: 0.6,
    maxTokens: 800,
  },
  'Outline': {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 1000,
  },
};

/**
 * Default configurations for different capabilities
 */
export const capabilityConfigs: Record<string, CapabilityConfig> = {
  'Blog Writer': {
    model: DEFAULT_MODEL,
    temperature: 0.7,
  },
  'Storyteller': {
    model: DEFAULT_MODEL,
    temperature: 0.8,
  },
  'SEO Optimizer': {
    model: DEFAULT_MODEL,
    temperature: 0.4,
  },
  'Outline Generator': {
    model: DEFAULT_MODEL,
    temperature: 0.6,
  },
};

/**
 * Get configuration for a specific content type
 * @param contentType The content type to get configuration for
 * @returns The configuration for the content type, or a default configuration
 */
export function getContentTypeConfig(contentType: string): ContentTypeConfig {
  // In a real implementation, you would load the configuration from a database or API
  // For this example, we'll just use the default configurations
  
  // Return from default configs or fallback
  return contentTypeConfigs[contentType] || {
    model: DEFAULT_MODEL,
    temperature: 0.7,
    maxTokens: 1000,
  };
}

/**
 * Get configuration for a specific capability
 * @param capability The capability to get configuration for
 * @returns The configuration for the capability, or a default configuration
 */
export function getCapabilityConfig(capability: string): CapabilityConfig {
  // In a real implementation, you would load the configuration from a database or API
  // For this example, we'll just use the default configurations
  
  // Return from default configs or fallback
  return capabilityConfigs[capability] || {
    model: DEFAULT_MODEL,
    temperature: 0.7,
  };
}

/**
 * Override all models with a specific model
 * This is useful for testing or when you want to use a specific model for all requests
 * @param model The model to use for all requests
 */
export function overrideAllModels(model: AIModel): void {
  // Update content type configs
  Object.keys(contentTypeConfigs).forEach(key => {
    contentTypeConfigs[key].model = model;
  });
  
  // Update capability configs
  Object.keys(capabilityConfigs).forEach(key => {
    capabilityConfigs[key].model = model;
  });
}

/**
 * Load configurations from the API
 * This can be used to refresh the configurations from the server
 * @returns A promise that resolves when the configurations are loaded
 */
export async function loadConfigurationsFromAPI(): Promise<boolean> {
  try {
    // Fetch the configurations from the API
    const response = await fetch('/api/ai-config');
    
    if (!response.ok) {
      console.error('Failed to load configurations from API:', response.statusText);
      return false;
    }
    
    const data = await response.json();
    
    // Update the content type configurations
    if (data.contentTypes) {
      Object.keys(data.contentTypes).forEach(key => {
        if (contentTypeConfigs[key]) {
          contentTypeConfigs[key] = data.contentTypes[key];
        } else {
          contentTypeConfigs[key] = data.contentTypes[key];
        }
      });
    }
    
    // Update the capability configurations
    if (data.capabilities) {
      Object.keys(data.capabilities).forEach(key => {
        if (capabilityConfigs[key]) {
          capabilityConfigs[key] = data.capabilities[key];
        } else {
          capabilityConfigs[key] = data.capabilities[key];
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error loading configurations from API:', error);
    return false;
  }
} 