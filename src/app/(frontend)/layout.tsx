import React from 'react';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import FrontendLayout from '@/components/layout/frontend-layout';
import { GenericPageSkeleton } from '@/components/ui/loading-skeleton';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <FrontendLayout>
      <Suspense fallback={<GenericPageSkeleton />}>
        {children}
      </Suspense>
      <Toaster position="bottom-right" />
    </FrontendLayout>
  );
} 