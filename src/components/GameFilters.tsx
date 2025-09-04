'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/games';
import { Filter, ArrowUpDown } from 'lucide-react';

export function GameFilters() {
  const t = useTranslations('games');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    updateFilter('search', searchValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchPlaceholder')}
        </label>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search games..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filterByCategory')}
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              currentCategory === ''
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                currentCategory === category.slug
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('sortBy')}
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('sort', '')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
              currentSort === ''
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Default
          </button>
          <button
            onClick={() => updateFilter('sort', 'popular')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
              currentSort === 'popular'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.popular')}
          </button>
          <button
            onClick={() => updateFilter('sort', 'newest')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
              currentSort === 'newest'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.newest')}
          </button>
          <button
            onClick={() => updateFilter('sort', 'rating')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
              currentSort === 'rating'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.rating')}
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory || currentSearch || currentSort) && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}