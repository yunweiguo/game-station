import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-gray-600">
            {query ? `Searching for "${query}"` : 'Enter a search term to find games'}
          </p>
        </div>

        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}