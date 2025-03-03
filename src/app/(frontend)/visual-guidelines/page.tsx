import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface VisualGuideline {
  id: string;
  name: string;
  color_palette: ColorPalette;
  image_style: string;
  logo_usage: string;
  typography: {
    primary_font: string;
    secondary_font: string;
    heading_style: string;
    body_style: string;
  };
  layout_preferences: string;
  image_content_guidelines: string;
  isActive: boolean;
}

export default async function VisualGuidelinesPage() {
  const supabase = await createClient();
  
  // Check if the user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login if not authenticated
    redirect('/auth/login?error=Please sign in to access visual guidelines settings');
  }
  
  // Fetch user's visual guidelines from the database
  const { data: userVisualGuidelines, error: fetchError } = await supabase
    .from('visual_guidelines')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (fetchError) {
    console.error('Error fetching visual guidelines:', fetchError);
  }
  
  // Use template visual guidelines if user doesn't have any
  const visualGuidelines: VisualGuideline[] = userVisualGuidelines && userVisualGuidelines.length > 0 
    ? userVisualGuidelines 
    : [
      {
        id: 'corporate',
        name: 'Corporate Brand',
        color_palette: {
          primary: '#0056b3',
          secondary: '#6c757d',
          accent: '#28a745',
          background: '#f8f9fa',
          text: '#212529',
        },
        image_style: 'Professional, clean images with natural lighting. Prefer images of people in business settings or abstract concepts related to growth and innovation.',
        logo_usage: 'Logo should appear in the top left corner of all materials. Maintain clear space around the logo equal to the height of the logo mark. Never distort or change the colors of the logo.',
        typography: {
          primary_font: 'Roboto',
          secondary_font: 'Open Sans',
          heading_style: 'Bold, 24-32px, primary color',
          body_style: 'Regular, 16px, text color',
        },
        layout_preferences: 'Clean, structured layouts with ample white space. Use a grid system for alignment. Maintain consistent margins and padding.',
        image_content_guidelines: 'Images should reflect diversity and inclusion. Avoid stereotypes and clichés. Images should support the content and not be purely decorative.',
        isActive: true,
      },
      {
        id: 'creative',
        name: 'Creative Agency',
        color_palette: {
          primary: '#ff4081',
          secondary: '#3f51b5',
          accent: '#ffeb3b',
          background: '#ffffff',
          text: '#333333',
        },
        image_style: 'Bold, vibrant images with high contrast. Use creative angles and compositions. Artistic photography with unique perspectives.',
        logo_usage: 'Logo can be used creatively but must remain recognizable. Allowed to use logo in any of the brand colors. Animated logo versions are encouraged for digital media.',
        typography: {
          primary_font: 'Montserrat',
          secondary_font: 'Playfair Display',
          heading_style: 'Extra Bold, 28-36px, primary or secondary color',
          body_style: 'Light, 18px, text color',
        },
        layout_preferences: 'Dynamic, asymmetrical layouts that create visual interest. Bold use of negative space. Overlapping elements are encouraged.',
        image_content_guidelines: 'Images should evoke emotion and creativity. Artistic, conceptual imagery is preferred. Use of abstract visuals to represent complex ideas.',
        isActive: false,
      },
      {
        id: 'tech',
        name: 'Tech Startup',
        color_palette: {
          primary: '#00bcd4',
          secondary: '#673ab7',
          accent: '#ff9800',
          background: '#fafafa',
          text: '#424242',
        },
        image_style: 'Modern, minimalist imagery with a focus on technology. Clean product shots on simple backgrounds. People using technology in natural settings.',
        logo_usage: 'Logo should be used in its original form on light backgrounds. For dark backgrounds, use the reversed (white) version. Maintain minimum size requirements for legibility.',
        typography: {
          primary_font: 'Inter',
          secondary_font: 'Source Code Pro',
          heading_style: 'Medium, 24-30px, primary color',
          body_style: 'Regular, 16px, text color with 1.5 line height',
        },
        layout_preferences: 'Minimalist, functional layouts with focus on usability. Consistent spacing and alignment. Use of cards and containers to organize content.',
        image_content_guidelines: 'Images should convey innovation and forward-thinking. Show diverse people using technology. Avoid generic stock photos and staged scenes.',
        isActive: false,
      },
    ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Visual Guidelines</h1>
          <p className="text-gray-600">Create and manage your visual content guidelines</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Create New Guidelines
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visualGuidelines.map((guideline) => (
          <div 
            key={guideline.id} 
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              guideline.isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{guideline.name}</h3>
                <div className="flex items-center">
                  {guideline.isActive && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      Active
                    </span>
                  )}
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Color Palette</h4>
                  <div className="flex space-x-2">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200" 
                        style={{ backgroundColor: guideline.color_palette.primary }}
                      ></div>
                      <span className="text-xs mt-1">Primary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200" 
                        style={{ backgroundColor: guideline.color_palette.secondary }}
                      ></div>
                      <span className="text-xs mt-1">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200" 
                        style={{ backgroundColor: guideline.color_palette.accent }}
                      ></div>
                      <span className="text-xs mt-1">Accent</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200" 
                        style={{ backgroundColor: guideline.color_palette.background }}
                      ></div>
                      <span className="text-xs mt-1">Background</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200" 
                        style={{ backgroundColor: guideline.color_palette.text }}
                      ></div>
                      <span className="text-xs mt-1">Text</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Typography</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Primary Font:</span> {guideline.typography.primary_font}</p>
                    <p><span className="font-medium">Secondary Font:</span> {guideline.typography.secondary_font}</p>
                    <p><span className="font-medium">Headings:</span> {guideline.typography.heading_style}</p>
                    <p><span className="font-medium">Body:</span> {guideline.typography.body_style}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Image Style</h4>
                  <p className="text-sm text-gray-600">{guideline.image_style}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Logo Usage</h4>
                  <p className="text-sm text-gray-600">{guideline.logo_usage}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Layout Preferences</h4>
                  <p className="text-sm text-gray-600">{guideline.layout_preferences}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Image Content Guidelines</h4>
                  <p className="text-sm text-gray-600">{guideline.image_content_guidelines}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex justify-between">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
              <button className={`text-sm font-medium ${
                guideline.isActive 
                  ? 'text-gray-500 hover:text-gray-700' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}>
                {guideline.isActive ? 'Deactivate' : 'Set as Active'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Visual Compliance Checker</h2>
        <p className="text-gray-600 mb-6">
          Check if your visual content complies with your guidelines. Upload an image to analyze.
        </p>
        
        <div className="border rounded-lg p-5">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select</p>
            <input type="file" className="hidden" accept="image/*" />
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 