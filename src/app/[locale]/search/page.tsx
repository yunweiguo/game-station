'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { SearchResultsClient } from '@/components/SearchResultsClient';
import { AdvancedSearchClient } from '@/components/AdvancedSearchClient';
import { getAllCategories } from '@/lib/games';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleAdvancedSearch = (filters: any) => {
    // Build search params from filters
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.minRating !== undefined) params.set('minRating', filters.minRating.toString());
    if (filters.maxRating !== undefined) params.set('maxRating', filters.maxRating.toString());
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    if (filters.featured) params.set('featured', 'true');
    if (filters.popular) params.set('popular', 'true');
    if (filters.new) params.set('new', 'true');

    // Navigate to search page with new parameters
    router.push(`/en/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>
            <p className="text-gray-600">
              {query ? `Searching for "${query}"` : 'Find your perfect game'}
            </p>
          </div>
          
          <AdvancedSearchClient 
            availableTags={['action', 'adventure', 'puzzle', 'strategy', 'sports', 'racing', 'shooter', 'arcade']}
            availableCategories={categories}
            onSearch={handleAdvancedSearch}
          />
        </div>

        <SearchResultsClient 
          query={query} 
          searchParams={{
            category: searchParams.get('category') || '',
            tags: searchParams.get('tags') || '',
            minRating: searchParams.get('minRating') || '',
            maxRating: searchParams.get('maxRating') || '',
            sortBy: searchParams.get('sortBy') || '',
            sortOrder: searchParams.get('sortOrder') || '',
            difficulty: searchParams.get('difficulty') || '',
            featured: searchParams.get('featured') || '',
            popular: searchParams.get('popular') || '',
            new: searchParams.get('new') || '',
          }}
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchContent />
  );
}