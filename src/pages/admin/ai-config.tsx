import { useState, useEffect } from 'react';
import { 
  AIModel, 
  contentTypeConfigs, 
  capabilityConfigs,
} from '@/lib/agent/core/config';

interface ContentTypeConfig {
  model: AIModel;
  temperature: number;
  maxTokens: number;
}

interface CapabilityConfig {
  model: AIModel;
  temperature: number;
}

export default function AIConfigPage() {
  const [contentTypes, setContentTypes] = useState<Record<string, ContentTypeConfig>>({});
  const [capabilities, setCapabilities] = useState<Record<string, CapabilityConfig>>({});
  const [globalModel, setGlobalModel] = useState<AIModel>(AIModel.GPT4OMini);
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize state from config
  useEffect(() => {
    // Fetch configurations from the API
    fetch('/api/ai-config')
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // If no configuration exists yet, use the default configs
            setContentTypes({...contentTypeConfigs});
            setCapabilities({...capabilityConfigs});
            return;
          }
          throw new Error('Failed to fetch configurations');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          // Update state with the fetched configurations
          if (data.contentTypes) {
            setContentTypes(data.contentTypes);
          } else {
            setContentTypes({...contentTypeConfigs});
          }
          
          if (data.capabilities) {
            setCapabilities(data.capabilities);
          } else {
            setCapabilities({...capabilityConfigs});
          }
        }
      })
      .catch(error => {
        console.error('Error fetching configurations:', error);
        // Use default configs if fetch fails
        setContentTypes({...contentTypeConfigs});
        setCapabilities({...capabilityConfigs});
      });
  }, []);

  // Handle content type config changes
  const handleContentTypeChange = (
    contentType: string, 
    field: 'model' | 'temperature' | 'maxTokens', 
    value: string | number
  ) => {
    setContentTypes({
      ...contentTypes,
      [contentType]: {
        ...contentTypes[contentType],
        [field]: field === 'temperature' || field === 'maxTokens' ? parseFloat(value.toString()) : value
      }
    });
  };

  // Handle capability config changes
  const handleCapabilityChange = (
    capability: string, 
    field: 'model' | 'temperature', 
    value: string | number
  ) => {
    setCapabilities({
      ...capabilities,
      [capability]: {
        ...capabilities[capability],
        [field]: field === 'temperature' ? parseFloat(value.toString()) : value
      }
    });
  };

  // Apply global model override
  const applyGlobalModel = () => {
    setIsApplying(true);
    
    // Update all models in the UI
    const updatedContentTypes = {...contentTypes};
    Object.keys(updatedContentTypes).forEach(key => {
      updatedContentTypes[key].model = globalModel;
    });
    
    const updatedCapabilities = {...capabilities};
    Object.keys(updatedCapabilities).forEach(key => {
      updatedCapabilities[key].model = globalModel;
    });
    
    // Create the payload with updated configuration
    const payload = {
      contentTypes: updatedContentTypes,
      capabilities: updatedCapabilities,
    };
    
    // Call the API endpoint to save the configuration
    fetch('/api/ai-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to apply global model');
        }
        return response.json();
      })
      .then(() => {
        // Update state with the new configurations
        setContentTypes(updatedContentTypes);
        setCapabilities(updatedCapabilities);
        
        // Show success message
        setSuccessMessage('Global model updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error applying global model:', error);
        setSuccessMessage('Error: Failed to apply global model');
        setTimeout(() => setSuccessMessage(''), 5000);
      })
      .finally(() => {
        setIsApplying(false);
      });
  };

  // Save all configuration changes
  const saveChanges = () => {
    setIsApplying(true);
    
    // Create the payload with current configuration
    const payload = {
      contentTypes,
      capabilities,
    };
    
    // Call the API endpoint to save the configuration
    fetch('/api/ai-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save configuration');
        }
        return response.json();
      })
      .then(() => {
        // Show success message
        setSuccessMessage('Configuration saved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error saving configuration:', error);
        setSuccessMessage('Error: Failed to save configuration');
        setTimeout(() => setSuccessMessage(''), 5000);
      })
      .finally(() => {
        setIsApplying(false);
      });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">AI Configuration</h1>
      
      {/* Global Model Override */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Global Model Override</h2>
        <p className="text-sm text-gray-600 mb-4">
          Change the model used across all content types and capabilities.
        </p>
        
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Model
            </label>
            <select
              value={globalModel}
              onChange={(e) => setGlobalModel(e.target.value as AIModel)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {Object.values(AIModel).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={applyGlobalModel}
            disabled={isApplying}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isApplying ? 'Applying...' : 'Apply to All'}
          </button>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Content Type Configurations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Content Type Configurations</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Content Type</th>
                <th className="py-2 px-4 border-b text-left">Model</th>
                <th className="py-2 px-4 border-b text-left">Temperature</th>
                <th className="py-2 px-4 border-b text-left">Max Tokens</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(contentTypes).map(([contentType, config]) => (
                <tr key={contentType} className="border-b">
                  <td className="py-2 px-4">{contentType}</td>
                  <td className="py-2 px-4">
                    <select
                      value={config.model}
                      onChange={(e) => handleContentTypeChange(contentType, 'model', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md"
                    >
                      {Object.values(AIModel).map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => handleContentTypeChange(contentType, 'temperature', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={config.maxTokens}
                      onChange={(e) => handleContentTypeChange(contentType, 'maxTokens', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Capability Configurations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Capability Configurations</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Capability</th>
                <th className="py-2 px-4 border-b text-left">Model</th>
                <th className="py-2 px-4 border-b text-left">Temperature</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(capabilities).map(([capability, config]) => (
                <tr key={capability} className="border-b">
                  <td className="py-2 px-4">{capability}</td>
                  <td className="py-2 px-4">
                    <select
                      value={config.model}
                      onChange={(e) => handleCapabilityChange(capability, 'model', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md"
                    >
                      {Object.values(AIModel).map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => handleCapabilityChange(capability, 'temperature', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveChanges}
          disabled={isApplying}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isApplying ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 