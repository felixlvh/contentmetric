import React from 'react';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';

// Fallback loading component in case DashboardSkeleton fails
function FallbackLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-40 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  console.log('Dashboard loading component rendering');
  
  try {
    // Check if DashboardSkeleton is defined
    if (typeof DashboardSkeleton !== 'function') {
      console.error('DashboardSkeleton is not a function:', DashboardSkeleton);
      return <FallbackLoading />;
    }
    
    return <DashboardSkeleton />;
  } catch (error) {
    console.error('Error rendering DashboardSkeleton:', error);
    return <FallbackLoading />;
  }
} 