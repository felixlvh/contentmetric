'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Document = {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
};

export default function RecentDocuments({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You don&apos;t have any documents yet.</p>
        <p className="mt-2">
          <Link href="/docs/new" className="text-blue-500 hover:text-blue-700">
            Create your first document
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Link 
          key={doc.id} 
          href={`/docs/${doc.id}`}
          className="block p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{doc.title}</h3>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
} 