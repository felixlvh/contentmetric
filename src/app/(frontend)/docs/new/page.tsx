'use client';

import React, { useState } from 'react';

// This would be your rich text editor component
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <div className="min-h-[300px] border border-gray-300 rounded-md p-4">
      <textarea 
        className="w-full h-full min-h-[300px] focus:outline-none" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your document content here..."
      />
    </div>
  );
};

export default function NewDocumentPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [template, setTemplate] = useState('');
  const [brandVoice, setBrandVoice] = useState('professional');
  const [category, setCategory] = useState('blog');
  const [status, setStatus] = useState('draft');

  const handleSave = async (isDraft: boolean = true) => {
    // TODO: Implement save functionality
    console.log('Saving document:', { title, content, template, brandVoice, category, status: isDraft ? 'draft' : 'published' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Document</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleSave(true)}
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave(false)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Document Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="blog">Blog Post</option>
              <option value="social">Social Media Post</option>
              <option value="email">Email Newsletter</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="brand-voice" className="block text-sm font-medium text-gray-700 mb-1">Brand Voice</label>
            <select
              id="brand-voice"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="authoritative">Authoritative</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="blog">Blog</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 