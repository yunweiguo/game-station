'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string
  category: string
  tags: string[]
  minRating?: number
  maxRating?: number
  difficulty?: string
  sortBy: string
  sortOrder: string
  featured?: boolean
  popular?: boolean
  new?: boolean
}

interface AdvancedSearchClientProps {
  availableTags: string[];
  availableCategories: Array<{ id: string; name: string; slug: string }>;
  onSearch: (filters: SearchFilters) => void;
}

export function AdvancedSearchClient({ availableTags, availableCategories, onSearch }: AdvancedSearchClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    tags: [] as string[],
    minRating: '',
    maxRating: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    difficulty: '',
    featured: false,
    popular: false,
    new: false
  });

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
      maxRating: filters.maxRating ? parseFloat(filters.maxRating) : undefined,
      difficulty: filters.difficulty && filters.difficulty !== 'any' ? filters.difficulty : undefined,
      featured: filters.featured || undefined,
      popular: filters.popular || undefined,
      new: filters.new || undefined
    };
    
    onSearch(searchFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: '',
      tags: [],
      minRating: '',
      maxRating: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
      difficulty: '',
      featured: false,
      popular: false,
      new: false
    });
  };

  const hasActiveFilters = () => {
    return filters.query || 
           filters.category || 
           filters.tags.length > 0 || 
           filters.minRating || 
           filters.maxRating || 
           filters.difficulty || 
           filters.featured || 
           filters.popular || 
           filters.new;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Search
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-1">
              {[
                filters.query && 'Search',
                filters.category && 'Category',
                filters.tags.length > 0 && 'Tags',
                (filters.minRating || filters.maxRating) && 'Rating',
                filters.difficulty && 'Difficulty',
                filters.featured && 'Featured',
                filters.popular && 'Popular',
                filters.new && 'New'
              ].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Query */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search Query</label>
            <Input
              placeholder="Search games..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {filters.tags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Min Rating</label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="0.0"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Rating</label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="5.0"
                value={filters.maxRating}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRating: e.target.value }))}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Game Types */}
          <div>
            <label className="text-sm font-medium mb-2 block">Game Types</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filters.featured ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters(prev => ({ ...prev, featured: !prev.featured }))}
              >
                Featured
              </Badge>
              <Badge
                variant={filters.popular ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters(prev => ({ ...prev, popular: !prev.popular }))}
              >
                Popular
              </Badge>
              <Badge
                variant={filters.new ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters(prev => ({ ...prev, new: !prev.new }))}
              >
                New
              </Badge>
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="play_count">Play Count</SelectItem>
                  <SelectItem value="created_at">Date Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Order</label>
              <Select value={filters.sortOrder} onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSearch}>
                Search Games
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}