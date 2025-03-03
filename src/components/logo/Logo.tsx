'use client';

import React from 'react';
import { proximaNova } from '@/app/fonts';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  withLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '',
  showTagline = false,
  withLink = true,
  size = 'md'
}) => {
  // Size classes for the logo text and dot
  const sizeClasses = {
    sm: {
      text: 'text-lg',
      dot: 'text-xl',
      tagline: 'text-xs'
    },
    md: {
      text: 'text-xl',
      dot: 'text-2xl',
      tagline: 'text-sm'
    },
    lg: {
      text: 'text-[48px]',
      dot: 'text-2xl',
      tagline: 'text-base'
    }
  };

  const logoContent = (
    <div className={cn(`flex flex-col items-center`, className)}>
      <div className={cn(`flex items-center ${proximaNova.className} relative`)}>
        <span className={cn('text-[#262627] font-semibold tracking-[-0.02em]', sizeClasses[size].text)}>
          contentmetric
        </span>
        <span 
          className={cn('text-[#6366F1] animate-pulse absolute', sizeClasses[size].dot)} 
          style={{ 
            animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite',
            bottom: '10px',
            right: '-10px',
            letterSpacing: '-0.05em'
          }}
        >
          •
        </span>
      </div>
      {showTagline && (
        <p className={cn('text-gray-500 mt-1', sizeClasses[size].tagline)}>Marketing Content Automation, Personalized by AI</p>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo; 