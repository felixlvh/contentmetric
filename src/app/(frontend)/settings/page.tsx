import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Check if the user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login if not authenticated
    redirect('/auth/login?error=Please sign in to access settings');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Settings Menu</h2>
            </div>
            <div className="p-2">
              <ul>
                <li>
                  <a href="#account" className="block px-4 py-2 text-blue-600 bg-blue-50 rounded font-medium">
                    Account Settings
                  </a>
                </li>
                <li>
                  <a href="#appearance" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    Appearance
                  </a>
                </li>
                <li>
                  <a href="#notifications" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    Notifications
                  </a>
                </li>
                <li>
                  <a href="#billing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    Billing & Subscription
                  </a>
                </li>
                <li>
                  <a href="#api" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    API Keys
                  </a>
                </li>
                <li>
                  <a href="#team" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                    Team Members
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div id="account" className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  id="language"
                  className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  id="timezone"
                  className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="utc">UTC</option>
                  <option value="est">Eastern Time (ET)</option>
                  <option value="cst">Central Time (CT)</option>
                  <option value="mst">Mountain Time (MT)</option>
                  <option value="pst">Pacific Time (PT)</option>
                </select>
              </div>
              <div>
                <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select
                  id="date-format"
                  className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="ymd">YYYY/MM/DD</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
          
          <div id="appearance" className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="light"
                      name="theme"
                      type="radio"
                      defaultChecked
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="light" className="ml-2 block text-sm text-gray-700">Light</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="dark"
                      name="theme"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="dark" className="ml-2 block text-sm text-gray-700">Dark</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="system"
                      name="theme"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="system" className="ml-2 block text-sm text-gray-700">System</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Density</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="comfortable"
                      name="density"
                      type="radio"
                      defaultChecked
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="comfortable" className="ml-2 block text-sm text-gray-700">Comfortable</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="compact"
                      name="density"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="compact" className="ml-2 block text-sm text-gray-700">Compact</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
          
          <div id="notifications" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="document-updates"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="document-updates" className="font-medium text-gray-700">Document Updates</label>
                  <p className="text-gray-500">Receive notifications when documents are updated or published.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="team-activity"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="team-activity" className="font-medium text-gray-700">Team Activity</label>
                  <p className="text-gray-500">Receive notifications about team member actions.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="system-updates"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="system-updates" className="font-medium text-gray-700">System Updates</label>
                  <p className="text-gray-500">Receive notifications about system updates and maintenance.</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 