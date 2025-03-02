import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <button className="px-3 py-1 bg-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white shadow rounded-lg p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'overview' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection('content')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'content' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Content Management
              </button>
              <button
                onClick={() => setActiveSection('users')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'users' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'settings' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
              <Link 
                href="/admin/ai-config"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'ai-config' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                AI Configuration
              </Link>
            </nav>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            {activeSection === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Stats Cards */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-indigo-800 font-medium">Total Users</h3>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-sm text-indigo-600">+12% from last month</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-green-800 font-medium">Content Items</h3>
                    <p className="text-2xl font-bold">567</p>
                    <p className="text-sm text-green-600">+5% from last month</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-purple-800 font-medium">AI Generations</h3>
                    <p className="text-2xl font-bold">8,901</p>
                    <p className="text-sm text-purple-600">+23% from last month</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                      href="/admin/ai-config"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Configure AI Settings</h4>
                        <p className="text-sm text-gray-500">Manage models and parameters</p>
                      </div>
                    </Link>
                    
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Generate Report</h4>
                        <p className="text-sm text-gray-500">Create usage analytics report</p>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Generated blog post</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 minutes ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Smith</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Updated brand voice</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin User</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Changed AI settings</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 hours ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'content' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Content Management</h2>
                <p className="text-gray-500">Content management features will be displayed here.</p>
              </div>
            )}
            
            {activeSection === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <p className="text-gray-500">User management features will be displayed here.</p>
              </div>
            )}
            
            {activeSection === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <p className="text-gray-500">Settings features will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 