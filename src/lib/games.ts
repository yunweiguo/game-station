import { supabase } from './supabase';
import { generateGamePlaceholder } from './images';

export interface Game {
  id: string;
  slug: string;
  title: string;
  name: string; // 保持向后兼容
  description: string;
  thumbnail: string;
  iframe_url: string;
  category_id: string;
  tags: string[];
  rating: number;
  play_count: number;
  playCount: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  category?: string;
  categoryName?: string;
  categorySlug?: string;
  categoryColor?: string;
  categoryIcon?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  game_count?: number;
}

export async function getFeaturedGames(): Promise<Game[]> {
  // Mock data for development
  const mockGames: Game[] = [
    {
      id: '1',
      slug: 'game-1',
      title: 'Adventure Quest',
      name: 'Adventure Quest',
      description: 'An exciting adventure game with stunning graphics and immersive gameplay.',
      thumbnail: generateGamePlaceholder('Adventure Quest', '#6366f1'),
      iframe_url: 'https://example.com/game1',
      category_id: '1',
      tags: ['adventure', 'action'],
      rating: 4.5,
      play_count: 1000,
      playCount: 1000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      slug: 'game-2',
      title: 'Puzzle Master',
      name: 'Puzzle Master',
      description: 'Challenge your mind with this brain-teasing puzzle game.',
      thumbnail: generateGamePlaceholder('Puzzle Master', '#10b981'),
      iframe_url: 'https://example.com/game2',
      category_id: '2',
      tags: ['puzzle', 'brain'],
      rating: 4.2,
      play_count: 800,
      playCount: 800,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching featured games:', error);
      return mockGames;
    }

    return (data || []).map(game => ({
      ...game,
      name: game.title, // 将 title 映射到 name 以保持向后兼容
      playCount: game.play_count
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return mockGames;
  }
}

export async function getPopularGames(): Promise<Game[]> {
  // Mock data for development
  const mockGames: Game[] = [
    {
      id: '3',
      slug: 'game-3',
      title: 'Racing Thunder',
      name: 'Racing Thunder',
      description: 'High-speed racing game with amazing cars and tracks.',
      thumbnail: generateGamePlaceholder('Racing Thunder', '#ef4444'),
      iframe_url: 'https://example.com/game3',
      category_id: '3',
      tags: ['racing', 'sports'],
      rating: 4.7,
      play_count: 1500,
      playCount: 1500,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      slug: 'game-4',
      title: 'Space Defender',
      name: 'Space Defender',
      description: 'Defend Earth from alien invaders in this action-packed space shooter.',
      thumbnail: generateGamePlaceholder('Space Defender', '#8b5cf6'),
      iframe_url: 'https://example.com/game4',
      category_id: '1',
      tags: ['space', 'shooter'],
      rating: 4.3,
      play_count: 1200,
      playCount: 1200,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .order('play_count', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching popular games:', error);
      return mockGames;
    }

    return (data || []).map(game => ({
      ...game,
      name: game.title, // 将 title 映射到 name 以保持向后兼容
      playCount: game.play_count
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return mockGames;
  }
}

export async function getGames(options?: {
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'rating' | 'play_count' | 'created_at';
}): Promise<{ games: Game[]; total: number }> {
  let query = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  if (options?.category) {
    query = query.eq('category_id', options.category);
  }

  if (options?.sortBy) {
    query = query.order(options.sortBy, { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching games:', error);
    return { games: [], total: 0 };
  }

  const games = (data || []).map(game => ({
    ...game,
    name: game.title, // 将 title 映射到 name 以保持向后兼容
    playCount: game.play_count
  }));

  return { games, total: count || 0 };
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  // Mock data for development - matching the slugs used in the configuration
  const mockGames: Record<string, Game> = {
    '2048': {
      id: '1',
      slug: '2048',
      title: '2048',
      name: '2048',
      description: 'Join the numbers and get to the 2048 tile! Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!',
      thumbnail: '/games/2048-thumbnail.jpg',
      iframe_url: 'https://play2048.co/',
      category_id: '2',
      tags: ['puzzle', 'brain', 'strategy'],
      rating: 4.5,
      play_count: 10000,
      playCount: 10000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      category: 'Puzzle',
      categoryName: 'Puzzle',
      categorySlug: 'puzzle',
      categoryColor: '#3b82f6',
      categoryIcon: '🧩'
    },
    'minesweeper': {
      id: '2',
      slug: 'minesweeper',
      title: 'Minesweeper',
      name: 'Minesweeper',
      description: 'Classic Minesweeper game. Find all mines without detonating any of them. Use logic and deduction to determine where the mines are hidden.',
      thumbnail: '/games/minesweeper-thumbnail.jpg',
      iframe_url: 'https://minesweeper.online/',
      category_id: '2',
      tags: ['puzzle', 'strategy', 'classic'],
      rating: 4.3,
      play_count: 8000,
      playCount: 8000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      category: 'Puzzle',
      categoryName: 'Puzzle',
      categorySlug: 'puzzle',
      categoryColor: '#3b82f6',
      categoryIcon: '🧩'
    },
    'solitaire': {
      id: '3',
      slug: 'solitaire',
      title: 'Solitaire',
      name: 'Solitaire',
      description: 'Classic Klondike Solitaire. Build up four foundation piles in suit from Ace to King. Tableau builds down in alternating colors.',
      thumbnail: '/games/solitaire-thumbnail.jpg',
      iframe_url: 'https://solitaire.king.com/',
      category_id: '2',
      tags: ['card', 'puzzle', 'classic'],
      rating: 4.4,
      play_count: 12000,
      playCount: 12000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      category: 'Puzzle',
      categoryName: 'Puzzle',
      categorySlug: 'puzzle',
      categoryColor: '#3b82f6',
      categoryIcon: '🧩'
    }
  };

  try {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color,
          icon
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching game by slug:', error);
      // Fall back to mock data if database fails
      if (mockGames[slug]) {
        console.log('Using mock data for game:', slug);
        return mockGames[slug];
      }
      return null;
    }

    if (!data) {
      // Use mock data if game not found in database
      if (mockGames[slug]) {
        console.log('Game not found in database, using mock data for:', slug);
        return mockGames[slug];
      }
      return null;
    }

  return {
    ...data,
    name: data.title, // 将 title 映射到 name 以保持向后兼容
    playCount: data.play_count || 0,
    category: data.categories?.name || '',
    categoryName: data.categories?.name || '',
    categorySlug: data.categories?.slug || '',
    categoryColor: data.categories?.color || '#3b82f6',
    categoryIcon: data.categories?.icon || '🎮'
  };
  } catch (error) {
    console.error('Database connection error:', error);
    // Fall back to mock data if database fails
    if (mockGames[slug]) {
      console.log('Using mock data for game:', slug);
      return mockGames[slug];
    }
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export interface AdvancedSearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: 'relevance' | 'rating' | 'play_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  difficulty?: 'easy' | 'medium' | 'hard';
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
}

export async function searchGames(query: string): Promise<Game[]> {
  return advancedSearchGames({ query });
}

export async function advancedSearchGames(filters: AdvancedSearchFilters): Promise<Game[]> {
  let query = supabase
    .from('games')
    .select('*')
    .eq('status', 'active');

  // Search query
  if (filters.query && filters.query.trim()) {
    const searchQuery = `%${filters.query}%`;
    query = query.or(`title.ilike.${searchQuery},description.ilike.${searchQuery}`);
  }

  // Category filter
  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  // Rating range
  if (filters.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }
  if (filters.maxRating !== undefined) {
    query = query.lte('rating', filters.maxRating);
  }

  // Game type filters
  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters.popular !== undefined) {
    query = query.eq('popular', filters.popular);
  }
  if (filters.new !== undefined) {
    query = query.eq('new', filters.new);
  }

  // Sorting
  if (filters.sortBy && filters.sortBy !== 'relevance') {
    const ascending = filters.sortOrder === 'asc';
    query = query.order(filters.sortBy, { ascending });
  } else if (filters.query) {
    // For relevance sorting with query, prioritize by name match, then rating
    query = query.order('rating', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Limit results
  query = query.limit(50);

  const { data, error } = await query;

  if (error) {
    console.error('Error in advanced search:', error);
    return [];
  }

  return (data || []).map(game => ({
    ...game,
    playCount: game.play_count
  }));
}

// Mock categories for development
export const categories: Category[] = [
  {
    id: '1',
    slug: 'action',
    name: 'Action',
    description: 'Fast-paced action games',
    icon: '⚔️',
    color: '#ef4444',
    sort_order: 1,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    game_count: 5
  },
  {
    id: '2',
    slug: 'puzzle',
    name: 'Puzzle',
    description: 'Brain-teasing puzzle games',
    icon: '🧩',
    color: '#3b82f6',
    sort_order: 2,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    game_count: 3
  },
  {
    id: '3',
    slug: 'adventure',
    name: 'Adventure',
    description: 'Explore new worlds',
    icon: '🗺️',
    color: '#10b981',
    sort_order: 3,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    game_count: 4
  },
  {
    id: '4',
    slug: 'strategy',
    name: 'Strategy',
    description: 'Test your tactical skills',
    icon: '♟️',
    color: '#8b5cf6',
    sort_order: 4,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    game_count: 2
  },
  {
    id: '5',
    slug: 'sports',
    name: 'Sports',
    description: 'Sports and racing games',
    icon: '⚽',
    color: '#f59e0b',
    sort_order: 5,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    game_count: 6
  }
];

export async function getAllGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all games:', error);
      return [];
    }

    return (data || []).map(game => ({
      ...game,
      name: game.title, // 将 title 映射到 name 以保持向后兼容
      playCount: game.play_count
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return [];
  }
}

export async function getGamesByCategory(categorySlug: string): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('category_id', categorySlug)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching games by category:', error);
      return [];
    }

    return (data || []).map(game => ({
      ...game,
      name: game.title, // 将 title 映射到 name 以保持向后兼容
      playCount: game.play_count
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      return categories;
    }

    return data || categories;
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return categories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return categories.find(cat => cat.slug === slug) || null;
    }

    return data;
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return categories.find(cat => cat.slug === slug) || null;
  }
}

export async function getRelatedGames(categoryId: string, excludeGameId: string): Promise<Game[]> {
  // Mock related games data
  const mockRelatedGames: Game[] = [
    {
      id: '4',
      slug: 'sudoku',
      title: 'Sudoku',
      name: 'Sudoku',
      description: 'Classic number puzzle game. Fill the grid so every row, column and 3x3 box contains 1-9.',
      thumbnail: '/games/sudoku-thumbnail.jpg',
      iframe_url: 'https://sudoku.com/',
      category_id: categoryId,
      tags: ['puzzle', 'brain', 'numbers'],
      rating: 4.2,
      play_count: 6000,
      playCount: 6000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      slug: 'crossword',
      title: 'Crossword',
      name: 'Crossword',
      description: 'Challenge your vocabulary with this classic crossword puzzle game.',
      thumbnail: '/games/crossword-thumbnail.jpg',
      iframe_url: 'https://www.theguardian.com/crosswords',
      category_id: categoryId,
      tags: ['puzzle', 'word', 'brain'],
      rating: 4.1,
      play_count: 4500,
      playCount: 4500,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      slug: 'word-search',
      title: 'Word Search',
      name: 'Word Search',
      description: 'Find hidden words in a grid of letters. A classic word puzzle game.',
      thumbnail: '/games/word-search-thumbnail.jpg',
      iframe_url: 'https://thewordsearch.com/',
      category_id: categoryId,
      tags: ['puzzle', 'word', 'search'],
      rating: 4.0,
      play_count: 3500,
      playCount: 3500,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      slug: 'jigsaw',
      title: 'Jigsaw Puzzle',
      name: 'Jigsaw Puzzle',
      description: 'Relaxing jigsaw puzzle game with beautiful images.',
      thumbnail: '/games/jigsaw-thumbnail.jpg',
      iframe_url: 'https://jigsawpuzzles.io/',
      category_id: categoryId,
      tags: ['puzzle', 'relaxing', 'images'],
      rating: 4.3,
      play_count: 5500,
      playCount: 5500,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .eq('category_id', categoryId)
      .neq('id', excludeGameId)
      .order('rating', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Error fetching related games:', error);
      // Fall back to mock data if database fails
      console.log('Using mock data for related games');
      return mockRelatedGames.filter(game => game.id !== excludeGameId).slice(0, 4);
    }

    if (!data || data.length === 0) {
      // Use mock data if no related games found in database
      console.log('No related games found in database, using mock data');
      return mockRelatedGames.filter(game => game.id !== excludeGameId).slice(0, 4);
    }

    return (data || []).map(game => ({
      ...game,
      name: game.title, // 将 title 映射到 name 以保持向后兼容
      playCount: game.play_count
    }));
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    return mockRelatedGames.filter(game => game.id !== excludeGameId).slice(0, 4);
  }
}