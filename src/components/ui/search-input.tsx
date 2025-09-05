'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  showSearchButton?: boolean;
  clearOnSearch?: boolean;
  disabled?: boolean;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className,
  debounceMs = 300,
  showSearchButton = true,
  clearOnSearch = false,
  disabled = false,
  loading = false,
  suggestions = [],
  onSuggestionSelect
}: SearchInputProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  // Handle keyboard navigation for suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[focusedIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, focusedIndex, suggestions]);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
    if (clearOnSearch) {
      onChange('');
    }
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.length > 0 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg",
              "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              "placeholder-gray-400 text-gray-900",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              showSuggestions && suggestions.length > 0 && "rounded-b-none",
              "focus:outline-none"
            )}
          />
          
          {loading && (
            <Loader2 className="absolute right-12 w-5 h-5 text-gray-400 animate-spin" />
          )}
          
          {value && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-10 p-0 h-auto w-auto hover:bg-transparent"
              disabled={disabled}
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </Button>
          )}
          
          {showSearchButton && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-2 p-2 h-auto w-auto hover:bg-transparent"
              disabled={disabled || loading}
            >
              <Search className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm",
                "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                "transition-colors duration-150",
                index === focusedIndex && "bg-gray-50 text-indigo-600",
                "border-b border-gray-100 last:border-b-0"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{suggestion}</span>
                {index === focusedIndex && (
                  <Search className="w-4 h-4 text-indigo-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Advanced search component with filters
interface AdvancedSearchFiltersProps {
  categories: Array<{ id: string; name: string }>;
  tags: string[];
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export function AdvancedSearchFilters({
  categories,
  tags,
  onFiltersChange,
  className
}: AdvancedSearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    tags: [] as string[],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      category: '',
      tags: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = filters.category || filters.tags.length > 0;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {filters.tags.length + (filters.category ? 1 : 0)}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full border transition-colors",
                    filters.tags.includes(tag)
                      ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  )}
                >
                  {tag}
                  {filters.tags.includes(tag) && (
                    <span className="ml-1">×</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="play_count">Play Count</option>
                <option value="created_at">Date Added</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}