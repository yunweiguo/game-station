'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/games';
import { Filter, ArrowUpDown } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const handleSearch = (searchValue: string) => {
    updateFilter('search', searchValue);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentSearch || currentSort;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              {[currentCategory, currentSearch, currentSort].filter(Boolean).length}
            </Badge>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchPlaceholder')}
        </label>
        <SearchInput
          value={currentSearch}
          onChange={(value) => updateFilter('search', value)}
          onSearch={handleSearch}
          placeholder="Search games..."
          showSearchButton={false}
          clearOnSearch={false}
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filterByCategory')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
              "flex items-center gap-2",
              currentCategory === ''
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {currentCategory === '' && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </span>
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
                "flex items-center gap-2",
                currentCategory === category.slug
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {currentCategory === category.slug && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </span>
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('sortBy')}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('sort', '')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
              "flex items-center gap-2",
              currentSort === ''
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {currentSort === '' && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </span>
            <ArrowUpDown className="w-4 h-4" />
            Default
          </button>
          <button
            onClick={() => updateFilter('sort', 'popular')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
              "flex items-center gap-2",
              currentSort === 'popular'
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {currentSort === 'popular' && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </span>
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.popular')}
          </button>
          <button
            onClick={() => updateFilter('sort', 'newest')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
              "flex items-center gap-2",
              currentSort === 'newest'
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {currentSort === 'newest' && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </span>
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.newest')}
          </button>
          <button
            onClick={() => updateFilter('sort', 'rating')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
              "flex items-center gap-2",
              currentSort === 'rating'
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {currentSort === 'rating' && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </span>
            <ArrowUpDown className="w-4 h-4" />
            {t('sortOptions.rating')}
          </button>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-1">
            {currentSearch && (
              <Badge variant="outline" className="text-xs">
                Search: &quot;{currentSearch}&quot;
              </Badge>
            )}
            {currentCategory && (
              <Badge variant="outline" className="text-xs">
                Category: {categories.find(c => c.slug === currentCategory)?.name}
              </Badge>
            )}
            {currentSort && (
              <Badge variant="outline" className="text-xs">
                Sort: {currentSort}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}