'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut, isLoading } = useAuth();
  
  useEffect(() => {
    // If still loading, wait for auth to initialize
    if (isLoading) return;
    
    async function handleLogout() {
      try {
        await signOut();
        // The signOut function already handles redirection
      } catch (error) {
        console.error('Error during logout:', error);
        // If there's an error, redirect to login with an error message
        router.push('/auth/login?error=Failed to log out. Please try again.');
      }
    }

    handleLogout();
  }, [signOut, router, isLoading]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Logging out...</h1>
        <p className="text-gray-600 text-center">
          Please wait while we log you out of your account.
        </p>
      </div>
    </div>
  );
} 