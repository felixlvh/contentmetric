import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL from the environment variable or use a default
 */
export function getBaseUrl() {
  // Use the NEXT_PUBLIC_SITE_URL environment variable if available
  if (typeof window !== 'undefined') {
    // Client-side: use the current window location
    return window.location.origin;
  }
  
  // Server-side: use the environment variable or default
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
} 