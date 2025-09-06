import { GameContentConfig } from '../../game-content';

export const game2048Config: GameContentConfig = {
  gameSlug: '2048',
  gameName: '2048',
  category: 'Puzzle Games',
  breadcrumbs: {
    category: 'Puzzle Games',
    gameName: '2048'
  },
  content: {
    about: {
      title: 'About 2048',
      description: '2048 is a captivating single-player sliding tile puzzle game that became a global phenomenon. Created by Italian web developer Gabriele Cirulli in March 2014, this deceptively simple game challenges players to merge tiles with matching numbers to reach the coveted 2048 tile.',
      developer: 'Gabriele Cirulli',
      releaseYear: 2014,
      genre: ['Puzzle', 'Strategy', 'Brain Training', 'Number Game'],
      background: 'The game was inspired by similar tile-merging games and was created in just five days. It quickly went viral, with millions of players worldwide trying to reach the 2048 tile. The game\'s success led to numerous clones and variations across different platforms.',
      difficulty: 'medium',
      audience: 'all'
    },
    howToPlay: {
      objective: 'Create a tile with the number 2048 by strategically merging identical tiles on a 4×4 grid.',
      setup: [
        'Game starts on a 4×4 grid with two randomly placed tiles (value 2 or 4)',
        'Use arrow keys (↑↓←→) to move all tiles simultaneously in the chosen direction',
        'New tiles (2 or 4) appear automatically after each move'
      ],
      gameplay: [
        'When two tiles with the same number touch, they merge into one tile with their sum',
        'Tiles slide as far as possible in the chosen direction until stopped by other tiles or walls',
        'The merged tile cannot merge again in the same move',
        'Plan your moves carefully to avoid filling up the grid'
      ],
      rules: [
        'Only tiles of the same value can merge together',
        'Each successful merge doubles the tile value (2+2=4, 4+4=8, etc.)',
        'The game ends when no valid moves remain (grid is full and no adjacent tiles can merge)',
        'Players can continue playing after reaching 2048 to achieve higher scores'
      ],
      scoring: [
        'Each merge adds the value of the new tile to your score',
        'Merging higher-value tiles gives more points',
        'Bonus points for creating multiple merges in one move',
        'Try to beat your high score with each game'
      ],
      winConditions: [
        'Primary goal: Create a tile with the value 2048',
        'Secondary goal: Achieve the highest possible score',
        'Challenge goal: Create tiles beyond 2048 (4096, 8192, etc.)'
      ],
      controls: [
        {
          type: 'keyboard',
          actions: [
            { input: '↑ Arrow Key', action: 'Move all tiles upward' },
            { input: '↓ Arrow Key', action: 'Move all tiles downward' },
            { input: '← Arrow Key', action: 'Move all tiles left' },
            { input: '→ Arrow Key', action: 'Move all tiles right' }
          ]
        },
        {
          type: 'touch',
          actions: [
            { input: 'Swipe Up', action: 'Move all tiles upward' },
            { input: 'Swipe Down', action: 'Move all tiles downward' },
            { input: 'Swipe Left', action: 'Move all tiles left' },
            { input: 'Swipe Right', action: 'Move all tiles right' }
          ]
        }
      ]
    },
    features: {
      keyFeatures: [
        'Simple yet deeply strategic gameplay',
        'Endless replayability with random tile generation',
        'Satisfying merging mechanics and visual feedback',
        'Progressive difficulty that adapts to player skill',
        'No time limits - play at your own pace',
        'Minimalist design with smooth animations'
      ],
      modes: [
        'Classic Mode - Traditional 2048 gameplay',
        'Time Attack - Race against the clock',
        'Zen Mode - No undo restrictions, relaxed gameplay',
        'Challenge Mode - Specific starting patterns'
      ],
      platforms: ['Web Browser', 'iOS', 'Android', 'Desktop'],
      technical: [
        'Responsive design works on all devices',
        'Instant loading with no installation required',
        'Touch-optimized for mobile devices',
        'Keyboard support for desktop players'
      ],
      social: [
        'Share your high scores with friends',
        'Compete on global leaderboards',
        'Challenge friends to beat your score'
      ]
    },
    strategy: {
      beginners: [
        'Keep your highest-value tile in a corner to prevent it from blocking moves',
        'Build tiles in descending order to create merging opportunities',
        'Focus on one direction (preferably down or right) for consistency',
        'Don\'t rush - take time to plan each move carefully',
        'Use the undo button if you make a mistake'
      ],
      advanced: [
        'Create tile chains for exponential growth opportunities',
        'Control the board position to maximize merging possibilities',
        'Plan multiple moves ahead to avoid getting stuck',
        'Balance between creating larger tiles and maintaining mobility',
        'Learn to recognize when to break your established pattern'
      ],
      expert: [
        'Master the corner strategy with optimal tile positioning',
        'Achieve the 4096 tile and beyond through perfect play',
        'Calculate move sequences to maximize scoring efficiency',
        'Recognize and exploit forced move situations',
        'Complete games with the maximum possible score'
      ],
      commonMistakes: [
        'Moving randomly without a strategy',
        'Letting high-value tiles get stuck in the middle',
        'Focusing only on one area of the board',
        'Not planning ahead for future moves',
        'Panicking when the board gets crowded'
      ]
    },
    variations: {
      variations: [
        {
          name: '2048 3D',
          description: 'Three-dimensional version with multiple layers',
          differences: [
            '3x3x3 cube instead of 4x4 grid',
            'Movement in three dimensions',
            'More complex strategy required'
          ]
        },
        {
          name: '2048 Hexagon',
          description: 'Hexagonal grid version with six-directional movement',
          differences: [
            'Hexagonal tiles instead of square',
            'Six possible movement directions',
            'Different strategic considerations'
          ]
        },
        {
          name: 'Power of 2',
          description: 'Educational version focusing on learning powers of 2',
          differences: [
            'Educational tooltips and hints',
            'Progressive difficulty levels',
            'Learning-focused scoring system'
          ]
        }
      ],
      customOptions: [
        {
          name: 'Grid Size',
          options: ['3x3', '4x4', '5x5', '6x6'],
          default: '4x4'
        },
        {
          name: 'Starting Tiles',
          options: ['2', '3', '4'],
          default: '2'
        },
        {
          name: 'Win Condition',
          options: ['2048', '4096', '8192', 'Unlimited'],
          default: '2048'
        },
        {
          name: 'Undo Limit',
          options: ['None', '3', '5', 'Unlimited'],
          default: 'None'
        }
      ]
    },
    funFacts: [
      'The game was created in just five days and went viral immediately',
      'The original 2048 was inspired by the game 1024, which was inspired by Threes',
      'The highest possible tile in the original game is 131,072',
      'The game has been played billions of times worldwide',
      'Many players have reported improved math skills after regular play',
      'The game\'s name comes from the target tile value: 2^11 = 2048'
    ],
    terminology: [
      { term: 'Tile Chain', definition: 'A sequence of tiles that can be merged in succession' },
      { term: 'Corner Strategy', definition: 'Keeping the highest tile in a corner for optimal board control' },
      { term: 'Forced Move', definition: 'A situation where only one valid move is available' },
      { term: 'Merging Efficiency', definition: 'The ratio of score gained to tiles moved' },
      { term: 'Board Lock', definition: 'When the grid is filled and no moves are possible' }
    ]
  },
  seo: {
    title: 'Play 2048 Game Online Free - Best Puzzle Game',
    description: 'Play 2048 game online free! Join the numbers and get to the 2048 tile. Best puzzle game for brain training. No download required.',
    keywords: ['2048 game', 'play 2048', '2048 online', 'puzzle game', 'brain game', 'number game', '2048 free', '2048 puzzle'],
    ogTitle: 'Play 2048 Game Online Free',
    ogDescription: 'Play the best 2048 puzzle game online free. Join numbers and get to 2048 tile!',
    ogImage: 'https://images.unsplash.com/photo-1554435264-45cf4372f008?w=1200&h=630&fit=crop'
  }
};