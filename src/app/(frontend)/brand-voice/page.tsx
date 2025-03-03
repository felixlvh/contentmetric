'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BrandVoiceCard from '@/components/brand-voice/BrandVoiceCard';
import BrandVoiceForm from '@/components/brand-voice/BrandVoiceForm';
import { BrandVoice } from '@/types/brand-voice';
import { BrandVoicePageSkeleton } from '@/components/ui/loading-skeleton';

export default function BrandVoicePage() {
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<BrandVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrandVoices();
  }, []);

  const fetchBrandVoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/brand-voice');
      if (!response.ok) {
        throw new Error('Failed to fetch brand voices');
      }
      const data = await response.json();
      setBrandVoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (brandVoice: BrandVoice) => {
    try {
      const response = await fetch(`/api/brand-voice/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: brandVoice.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to set active brand voice');
      }

      await fetchBrandVoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set active brand voice');
    }
  };

  const handleDelete = async (brandVoice: BrandVoice) => {
    if (!confirm('Are you sure you want to delete this brand voice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/brand-voice/${brandVoice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete brand voice');
      }

      await fetchBrandVoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand voice');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Brand Voice</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your brand voices to maintain consistent communication
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedVoice(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Brand Voice
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <BrandVoicePageSkeleton />
      ) : brandVoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No brand voices yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first brand voice
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandVoices.map((brandVoice) => (
            <BrandVoiceCard
              key={brandVoice.id}
              brandVoice={brandVoice}
              onEdit={() => {
                setSelectedVoice(brandVoice);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onSetActive={handleSetActive}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <BrandVoiceForm
          brandVoice={selectedVoice || undefined}
          onSubmit={() => {
            setIsFormOpen(false);
            fetchBrandVoices();
          }}
          onCancel={() => setIsFormOpen(false)}
          isEdit={!!selectedVoice}
        />
      )}
    </div>
  );
} 