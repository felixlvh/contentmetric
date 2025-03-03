'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt_template: string;
  input_fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number';
    placeholder?: string;
    options?: string[];
    required: boolean;
  }[];
  output_format: 'markdown' | 'html' | 'text';
  created_at: string;
  uses: number;
}

export default function TemplatesPage() {
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(true);
      const supabase = createClient();
      
      // Check if the user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Redirect to login if not authenticated
        router.push('/auth/login?error=Please sign in to access templates');
        return;
      }
      
      // Fetch user's templates from the database
      const { data: templates, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error('Error fetching templates:', fetchError);
        setError('Failed to load templates');
      } else {
        setUserTemplates(templates || []);
      }
      
      setIsLoading(false);
    }
    
    fetchTemplates();
  }, [router]);
  
  // Categories for filtering
  const categories = [
    'All',
    'Blog Posts',
    'Social Media',
    'Email',
    'Marketing',
    'SEO',
    'Product',
    'Custom'
  ];
  
  // Use template examples if user doesn't have any
  const templates: Template[] = userTemplates.length > 0 
    ? userTemplates 
    : [
      {
        id: 'blog-post',
        name: 'Blog Post Generator',
        description: 'Create engaging blog posts with a structured format including introduction, main points, and conclusion.',
        category: 'Blog Posts',
        icon: '📝',
        prompt_template: 'Write a blog post about {topic}. The target audience is {audience}. The tone should be {tone}. Include {num_points} main points and a compelling conclusion. Keywords to include: {keywords}.',
        input_fields: [
          {
            name: 'topic',
            label: 'Blog Topic',
            type: 'text',
            placeholder: 'E.g., Content Marketing Strategies for 2023',
            required: true,
          },
          {
            name: 'audience',
            label: 'Target Audience',
            type: 'text',
            placeholder: 'E.g., Marketing professionals, Small business owners',
            required: true,
          },
          {
            name: 'tone',
            label: 'Tone of Voice',
            type: 'select',
            options: ['Professional', 'Conversational', 'Educational', 'Persuasive', 'Entertaining'],
            required: true,
          },
          {
            name: 'num_points',
            label: 'Number of Main Points',
            type: 'number',
            required: true,
          },
          {
            name: 'keywords',
            label: 'Keywords to Include',
            type: 'textarea',
            placeholder: 'Enter keywords separated by commas',
            required: false,
          },
        ],
        output_format: 'markdown',
        created_at: '2023-01-15T10:30:00Z',
        uses: 42,
      },
      {
        id: 'social-post',
        name: 'Social Media Post',
        description: 'Generate engaging social media posts optimized for different platforms.',
        category: 'Social Media',
        icon: '📱',
        prompt_template: 'Create a {platform} post about {topic}. The post should be {tone} in tone and include {hashtags_count} relevant hashtags. Include a call to action: {cta}.',
        input_fields: [
          {
            name: 'platform',
            label: 'Platform',
            type: 'select',
            options: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'],
            required: true,
          },
          {
            name: 'topic',
            label: 'Post Topic',
            type: 'text',
            placeholder: 'E.g., New product launch, Industry news',
            required: true,
          },
          {
            name: 'tone',
            label: 'Tone',
            type: 'select',
            options: ['Professional', 'Casual', 'Excited', 'Informative'],
            required: true,
          },
          {
            name: 'hashtags_count',
            label: 'Number of Hashtags',
            type: 'number',
            required: true,
          },
          {
            name: 'cta',
            label: 'Call to Action',
            type: 'text',
            placeholder: 'E.g., Visit our website, Sign up for our newsletter',
            required: false,
          },
        ],
        output_format: 'text',
        created_at: '2023-02-20T14:15:00Z',
        uses: 78,
      },
      {
        id: 'product-description',
        name: 'Product Description',
        description: 'Create compelling product descriptions that highlight features and benefits.',
        category: 'Product',
        icon: '🛍️',
        prompt_template: 'Write a product description for {product_name}, which is a {product_type}. The key features are: {features}. The main benefits are: {benefits}. The target audience is {audience}. The price point is {price_point}.',
        input_fields: [
          {
            name: 'product_name',
            label: 'Product Name',
            type: 'text',
            required: true,
          },
          {
            name: 'product_type',
            label: 'Product Type',
            type: 'text',
            placeholder: 'E.g., Smartphone, Software tool, Kitchen appliance',
            required: true,
          },
          {
            name: 'features',
            label: 'Key Features',
            type: 'textarea',
            placeholder: 'List the main features of your product',
            required: true,
          },
          {
            name: 'benefits',
            label: 'Main Benefits',
            type: 'textarea',
            placeholder: 'How does your product help customers?',
            required: true,
          },
          {
            name: 'audience',
            label: 'Target Audience',
            type: 'text',
            required: true,
          },
          {
            name: 'price_point',
            label: 'Price Point',
            type: 'select',
            options: ['Budget', 'Mid-range', 'Premium', 'Luxury'],
            required: true,
          },
        ],
        output_format: 'html',
        created_at: '2023-03-10T09:45:00Z',
        uses: 36,
      },
      {
        id: 'email-newsletter',
        name: 'Email Newsletter',
        description: 'Generate engaging email newsletters with customizable sections and calls to action.',
        category: 'Email',
        icon: '✉️',
        prompt_template: 'Create an email newsletter with the subject: {subject}. The main topic is {main_topic}. Include {num_sections} sections. The newsletter should have a {tone} tone. Include the following news items: {news_items}. End with this call to action: {cta}.',
        input_fields: [
          {
            name: 'subject',
            label: 'Email Subject',
            type: 'text',
            placeholder: 'E.g., Your Weekly Industry Update',
            required: true,
          },
          {
            name: 'main_topic',
            label: 'Main Topic',
            type: 'text',
            required: true,
          },
          {
            name: 'num_sections',
            label: 'Number of Sections',
            type: 'number',
            required: true,
          },
          {
            name: 'tone',
            label: 'Tone',
            type: 'select',
            options: ['Professional', 'Friendly', 'Urgent', 'Informative'],
            required: true,
          },
          {
            name: 'news_items',
            label: 'News Items to Include',
            type: 'textarea',
            placeholder: 'List the news items or updates to include',
            required: true,
          },
          {
            name: 'cta',
            label: 'Call to Action',
            type: 'text',
            required: true,
          },
        ],
        output_format: 'html',
        created_at: '2023-04-05T11:20:00Z',
        uses: 29,
      },
    ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Templates</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Templates</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Content Templates</h1>
          <p className="text-gray-600">Create and use custom content generation templates</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Create New Template
        </button>
      </div>
      
      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button 
              key={category}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start mb-3">
                <span className="text-3xl mr-3">{template.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Used {template.uses} times</span>
                <span>Output: {template.output_format}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex justify-between">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Use Template
              </button>
            </div>
          </div>
        ))}
        
        {/* Add new template card */}
        <div className="border border-dashed rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
          <div className="p-5 flex flex-col items-center justify-center text-center h-full">
            <span className="text-3xl mb-3">➕</span>
            <h3 className="text-lg font-semibold mb-2">Create Custom Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Build a custom template for your specific content needs
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Recently Used Templates</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Uses
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.slice(0, 3).map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{template.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(template.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.uses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 