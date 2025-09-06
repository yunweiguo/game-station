/**
 * 首页配置文件
 * 用于快速配置主推游戏和SEO设置
 * 每次有新的热点时，修改此文件即可快速部署新站点
 */

export interface HomePageConfig {
  // 主推游戏配置
  featuredGame: {
    id: string;
    slug: string;
    name: string;
    title: string;
    description: string;
    thumbnail: string;
    iframe_url: string;
    tags: string[];
    rating: number;
    play_count: number;
    category: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  
  // SEO 配置
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  
  // 首页内容配置
  content: {
    heroTitle: string;
    heroSubtitle: string;
    gameInstructions: string[];
    gameFeatures: string[];
    tips: string[];
    callToAction: string;
  };
  
  // 其他游戏展示配置
  otherGames: {
    title: string;
    subtitle: string;
    limit: number;
    sortBy: 'rating' | 'play_count' | 'created_at';
  };
  
  // 社交分享配置
  social: {
    shareTitle: string;
    shareDescription: string;
    shareHashtags: string[];
  };
}

// 默认配置 - 以2048游戏为例
export const defaultHomePageConfig: HomePageConfig = {
  featuredGame: {
    id: '1',
    slug: '2048-game',
    name: '2048',
    title: '2048 Game',
    description: 'Join the numbers and get to the 2048 tile! Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    iframe_url: 'https://play2048.co/',
    tags: ['puzzle', 'brain', 'strategy', 'numbers'],
    rating: 4.8,
    play_count: 1000000,
    category: 'puzzle',
    difficulty: 'medium'
  },
  
  seo: {
    title: 'Play 2048 Game Online Free - Best 2048 Puzzle Game',
    description: 'Play 2048 game online free! Join numbers to get 2048 tile. Best puzzle game for brain training. No download required. Play now on desktop and mobile!',
    keywords: ['2048 game', 'play 2048', '2048 online', 'puzzle game', 'brain game', 'number game', '2048 free', '2048 puzzle'],
    ogTitle: 'Play 2048 Game Online Free',
    ogDescription: 'Play the best 2048 puzzle game online free. Join numbers and get to 2048 tile!',
    ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop'
  },
  
  content: {
    heroTitle: 'Play 2048 Game Online Free',
    heroSubtitle: 'The addictive puzzle game that took the world by storm',
    gameInstructions: [
      'Use your arrow keys to move the tiles',
      'When two tiles with the same number touch, they merge into one',
      'Try to create a tile with the number 2048',
      'You can continue playing after reaching 2048 to get higher scores'
    ],
    gameFeatures: [
      'Smooth and responsive gameplay',
      'Works perfectly on desktop and mobile',
      'No download or installation required',
      'Save your progress automatically',
      'Compete with players worldwide'
    ],
    tips: [
      'Focus on keeping your largest tile in a corner',
      'Try to build larger tiles in a descending order',
      'Plan your moves ahead to avoid getting stuck',
      'Use the undo button if you make a mistake'
    ],
    callToAction: 'Start playing 2048 now and challenge yourself to reach the 2048 tile!'
  },
  
  otherGames: {
    title: 'More Popular Games',
    subtitle: 'Discover other exciting games you might like',
    limit: 8,
    sortBy: 'rating'
  },
  
  social: {
    shareTitle: '2048 Game - Play Free Online',
    shareDescription: 'Challenge yourself with the addictive 2048 puzzle game!',
    shareHashtags: ['2048', 'puzzlegame', 'braingame', 'onlinegame']
  }
};

// 可以创建多个预设配置，快速切换不同的游戏
export const gameConfigs = {
  '2048': defaultHomePageConfig,
  'solitaire': {
    ...defaultHomePageConfig,
    featuredGame: {
      id: '2',
      slug: 'solitaire-classic',
      name: 'Solitaire Classic',
      title: 'Solitaire Classic',
      description: 'Play the classic Solitaire card game online free. The most popular patience card game. Perfect for brain training and relaxation.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      iframe_url: 'https://www.solitaire.org/',
      tags: ['card', 'solitaire', 'patience', 'classic'],
      rating: 4.7,
      play_count: 500000,
      category: 'card',
      difficulty: 'easy'
    },
    seo: {
      title: 'Play Solitaire Classic Online Free - Best Card Game',
      description: 'Play Solitaire Classic online free! The most popular patience card game. Perfect for brain training and relaxation. No download required.',
      keywords: ['solitaire', 'card game', 'patience', 'solitaire classic', 'online solitaire', 'free solitaire'],
      ogTitle: 'Play Solitaire Classic Online Free',
      ogDescription: 'Play the best Solitaire Classic card game online free. Perfect for brain training!',
      ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop'
    },
    content: {
      heroTitle: 'Play Solitaire Classic Online Free',
      heroSubtitle: 'The most popular patience card game',
      gameInstructions: [
        'Build four foundation piles up in suit from Ace to King',
        'Build tableau piles down in alternating colors',
        'You can move sequences of cards if they are in alternating colors',
        'Click the stock pile to deal new cards'
      ],
      gameFeatures: [
        'Classic Solitaire gameplay',
        'Beautiful card designs',
        'Hint system for beginners',
        'Statistics tracking',
        'Multiple difficulty levels'
      ],
      tips: [
        'Always move Aces and Deuces to the foundation',
        'Try to expose face-down cards as soon as possible',
        'Build long sequences to give yourself more options',
        'Use the undo feature to experiment with different moves'
      ],
      callToAction: 'Start playing Solitaire Classic now and enjoy the most popular card game!'
    }
  },
  'minesweeper': {
    ...defaultHomePageConfig,
    featuredGame: {
      id: '3',
      slug: 'minesweeper-classic',
      name: 'Minesweeper Classic',
      title: 'Minesweeper Classic',
      description: 'Play the classic Minesweeper game online free. Use logic and strategy to avoid mines. The perfect puzzle game for brain training.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      iframe_url: 'https://minesweeper.online/',
      tags: ['puzzle', 'strategy', 'logic', 'classic'],
      rating: 4.6,
      play_count: 750000,
      category: 'puzzle',
      difficulty: 'hard'
    },
    seo: {
      title: 'Play Minesweeper Classic Online Free - Best Logic Game',
      description: 'Play Minesweeper Classic online free! Use logic and strategy to avoid mines. Perfect puzzle game for brain training. No download required.',
      keywords: ['minesweeper', 'logic game', 'puzzle game', 'brain game', 'minesweeper classic', 'online minesweeper'],
      ogTitle: 'Play Minesweeper Classic Online Free',
      ogDescription: 'Play the best Minesweeper Classic logic game online free. Train your brain!',
      ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop'
    },
    content: {
      heroTitle: 'Play Minesweeper Classic Online Free',
      heroSubtitle: 'The ultimate logic and strategy puzzle game',
      gameInstructions: [
        'Left-click to reveal a tile',
        'Right-click to flag a potential mine',
        'Numbers show how many mines are adjacent to that tile',
        'Use logic to determine which tiles are safe to click'
      ],
      gameFeatures: [
        'Classic Minesweeper gameplay',
        'Multiple difficulty levels',
        'Custom game settings',
        'Best time tracking',
        'Hint system for beginners'
      ],
      tips: [
        'Start with corners and edges',
        'Look for patterns and logical deductions',
        'Use the numbered tiles to deduce mine locations',
        'Flag mines when you are certain of their location'
      ],
      callToAction: 'Challenge yourself with Minesweeper Classic and test your logical thinking skills!'
    }
  }
};

// 当前使用的配置（可以轻松切换）
export const currentConfig = defaultHomePageConfig;