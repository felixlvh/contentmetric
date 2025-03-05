'use client';

import { clsx } from 'clsx'
import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  /**
   * The width of the skeleton
   * @default 'full'
   */
  width?: 'full' | number | string
  /**
   * The height of the skeleton
   * @default 20
   */
  height?: number | string
}

/**
 * Base skeleton component that all other skeletons are built upon
 */
function Skeleton({ className, width = 'full', height = 20, ...props }: SkeletonProps) {
  const widthClass = width === 'full' ? 'w-full' : typeof width === 'number' ? `w-[${width}px]` : `w-[${width}]`
  
  return (
    <div
      className={clsx(
        'animate-pulse rounded bg-gray-200',
        widthClass,
        typeof height === 'number' ? `h-[${height}px]` : `h-[${height}]`,
        className
      )}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  )
}

/**
 * Generic page header skeleton with title and action buttons
 */
export function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex space-x-3">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

/**
 * Generic card skeleton for dashboard widgets
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

interface GridSkeletonProps {
  columns?: number
  items?: number
  className?: string
}

/**
 * Grid of card skeletons
 */
export function GridSkeleton({ columns = 3, items = 3, className }: GridSkeletonProps) {
  return (
    <div 
      className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
      role="status"
      aria-label="Loading grid items..."
    >
      {[...Array(items)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  className?: string
}

/**
 * Table skeleton for data listings
 */
export function TableSkeleton({ rows = 5, className }: TableSkeletonProps) {
  return (
    <div 
      className={clsx('bg-white rounded-lg shadow overflow-hidden', className)}
      role="status"
      aria-label="Loading table data..."
    >
      <Skeleton height={48} className="bg-gray-100" />
      {[...Array(rows)].map((_, index) => (
        <Skeleton key={index} height={64} className="border-b border-gray-200" />
      ))}
    </div>
  )
}

/**
 * Form field skeleton
 */
export function FormFieldSkeleton() {
  return (
    <div className="mb-6" role="status" aria-label="Loading form field...">
      <Skeleton width={128} height={16} className="mb-2" />
      <Skeleton height={40} />
    </div>
  )
}

/**
 * Text area skeleton for content editors
 */
export function TextAreaSkeleton() {
  return (
    <div className="mb-6" role="status" aria-label="Loading text editor...">
      <Skeleton width={80} height={16} className="mb-2" />
      <div className="min-h-[300px] border border-gray-200 rounded-md p-4 bg-gray-50">
        <Skeleton height={16} className="mb-3" />
        <Skeleton width="75%" height={16} className="mb-3" />
        <Skeleton width="83%" height={16} className="mb-3" />
        <Skeleton width="66%" height={16} className="mb-3" />
        <Skeleton width="80%" height={16} />
      </div>
    </div>
  )
}

/**
 * Filter controls skeleton
 */
export function FiltersSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full md:w-auto">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full md:w-auto md:flex-grow">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Template card skeleton
 */
export function TemplateCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

/**
 * Templates grid skeleton
 */
export function TemplatesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <TemplateCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Dashboard skeleton - used for the main dashboard page
 */
export function DashboardSkeleton() {
  console.log('DashboardSkeleton component rendering');
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
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Documents list skeleton
 */
export function DocumentsListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <FiltersSkeleton />
      <TableSkeleton rows={5} />
    </div>
  );
}

/**
 * Document editor skeleton
 */
export function DocumentEditorSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <FormFieldSkeleton />
        <TextAreaSkeleton />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Templates list skeleton
 */
export function TemplatesListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <TemplatesGridSkeleton />
    </div>
  );
}

/**
 * Generic page skeleton - used as a fallback for any page
 */
export function GenericPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Brand Voice Card Skeleton - mimics the structure of a brand voice card
 */
export function BrandVoiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow animate-pulse">
      <div className="px-4 py-5 sm:p-6">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Tone section */}
          <div>
            <div className="h-3 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="flex flex-wrap gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={`tone-${i}`} className="h-6 w-16 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Style section */}
          <div>
            <div className="h-3 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="flex flex-wrap gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={`style-${i}`} className="h-6 w-20 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Personality section */}
          <div>
            <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="flex flex-wrap gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={`personality-${i}`} className="h-6 w-18 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Audience section */}
          <div className="col-span-2">
            <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-6 w-full bg-gray-200 rounded-md"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
        <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

/**
 * Brand Voice Page Skeleton - used for the brand voice management page
 */
export function BrandVoicePageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with title and new button */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Grid of brand voice cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <BrandVoiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
} 