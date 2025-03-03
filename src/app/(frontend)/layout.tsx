import React from 'react';
import { Suspense } from 'react';
import FrontendLayout from '@/components/layout/frontend-layout';
import { GenericPageSkeleton } from '@/components/ui/loading-skeleton';

interface FrontendLayoutProps {
  children: React.ReactNode;
}

export default function FrontendRootLayout({ children }: FrontendLayoutProps) {
  return (
    <FrontendLayout>
      <Suspense fallback={<GenericPageSkeleton />}>
        {children}
      </Suspense>
    </FrontendLayout>
  );
} 