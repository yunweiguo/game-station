"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  TrendingUp,
  Target,
  Tag
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

interface AdvancedSearchFilters {
  query: string
  category: string
  tags: string[]
  minRating: number
  maxRating: number
  sortBy: 'relevance' | 'rating' | 'play_count' | 'created_at'
  sortOrder: 'asc' | 'desc'
  difficulty?: 'easy' | 'medium' | 'hard'
  featured?: boolean
  popular?: boolean
  new?: boolean
}

interface AdvancedSearchProps {
  onSearch: (filters: AdvancedSearchFilters) => void
  availableTags: string[]
  availableCategories: Array<{ id: string; name: string; slug: string }>
}

export function AdvancedSearch({ onSearch, availableTags, availableCategories }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: '',
    category: '',
    tags: [],
    minRating: 0,
    maxRating: 5,
    sortBy: 'relevance',
    sortOrder: 'desc',
    difficulty: undefined,
    featured: undefined,
    popular: undefined,
    new: undefined
  })

  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({
      query: '',
      category: '',
      tags: [],
      minRating: 0,
      maxRating: 5,
      sortBy: 'relevance',
      sortOrder: 'desc',
      difficulty: undefined,
      featured: undefined,
      popular: undefined,
      new: undefined
    })
    setTagInput('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Filter games by various criteria to find exactly what you're looking for.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search games..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="flex-1"
              />
              <Search className="h-4 w-4 text-gray-400 mt-3" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating Range</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">{filters.minRating}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minRating: parseFloat(e.target.value) 
                }))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">{filters.maxRating}</span>
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select 
              value={filters.difficulty || ''} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                difficulty: value as 'easy' | 'medium' | 'hard' || undefined 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Game Types */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Game Types</label>
            <div className="flex gap-2">
              <Button
                variant={filters.featured ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  featured: prev.featured ? undefined : true 
                }))}
              >
                <Star className="h-4 w-4 mr-1" />
                Featured
              </Button>
              <Button
                variant={filters.popular ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  popular: prev.popular ? undefined : true 
                }))}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular
              </Button>
              <Button
                variant={filters.new ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  new: prev.new ? undefined : true 
                }))}
              >
                <Clock className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  sortBy: value as 'relevance' | 'rating' | 'play_count' | 'created_at'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="play_count">Play Count</SelectItem>
                  <SelectItem value="created_at">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Select 
                value={filters.sortOrder} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: value as 'asc' | 'desc'
                }))}
              >
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}