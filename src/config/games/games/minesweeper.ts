import { GameContentConfig } from '../../game-content';

export const gameMinesweeperConfig: GameContentConfig = {
  gameSlug: 'minesweeper-classic',
  gameName: 'Minesweeper Classic',
  category: 'Strategy Games',
  breadcrumbs: {
    category: 'Strategy Games',
    gameName: 'Minesweeper Classic'
  },
  content: {
    about: {
      title: 'About Minesweeper Classic',
      description: 'Minesweeper Classic is the ultimate logic and strategy puzzle game that has challenged players for decades. This single-player game requires careful thinking, pattern recognition, and deductive reasoning to safely navigate a minefield and clear all safe squares.',
      developer: 'Microsoft',
      releaseYear: 1989,
      genre: ['Strategy', 'Logic Puzzle', 'Brain Training', 'Patience Game'],
      background: 'Minesweeper was originally created for Microsoft Windows and became one of the most popular pre-installed games of all time. The game has its roots in earlier mainframe games from the 1960s and 1970s, but was popularized by its inclusion with Windows, becoming a global phenomenon.',
      difficulty: 'hard',
      audience: 'teens'
    },
    howToPlay: {
      objective: 'Clear all squares on the grid without detonating any mines, using logic and number clues to determine safe squares.',
      setup: [
        'Choose difficulty level (Beginner, Intermediate, Expert)',
        'Grid appears with all squares covered',
        'Mines are randomly placed (known to the game but not visible to player)',
        'Click any square to start the game'
      ],
      gameplay: [
        'Left-click to reveal a square',
        'Right-click to flag a suspected mine',
        'Numbers show how many mines are adjacent to that square',
        'Use logical deduction to determine which squares are safe',
        'Clear all non-mine squares to win the game'
      ],
      rules: [
        'The first click is always safe and will never be a mine',
        'Numbers indicate exactly how many mines are in the 8 adjacent squares',
        'Flag suspected mines with right-click to prevent accidental clicks',
        'If you reveal a mine, the game ends immediately',
        'Win by revealing all non-mine squares'
      ],
      scoring: [
        'Score based on time taken to complete',
        'Bonus points for fewer flags used',
        'Difficulty multipliers for harder levels',
        'Record your best times for each difficulty',
        'Perfect games (no mistakes) receive extra bonuses'
      ],
      winConditions: [
        'Reveal all squares that do not contain mines',
        'Correctly flag all mines (optional but recommended)',
        'Complete the game in the shortest time possible',
        'Use the minimum number of flags for efficiency'
      ],
      controls: [
        {
          type: 'mouse',
          actions: [
            { input: 'Left Click', action: 'Reveal a square' },
            { input: 'Right Click', action: 'Place/remove flag' },
            { input: 'Double Click', action: 'Auto-reveal adjacent squares' }
          ]
        },
        {
          type: 'keyboard',
          actions: [
            { input: 'Arrow Keys', action: 'Move cursor around grid' },
            { input: 'Enter/Space', action: 'Reveal square at cursor' },
            { input: 'F', action: 'Place/remove flag at cursor' }
          ]
        },
        {
          type: 'touch',
          actions: [
            { input: 'Tap', action: 'Reveal a square' },
            { input: 'Long Press', action: 'Place/remove flag' },
            { input: 'Double Tap', action: 'Auto-reveal adjacent squares' }
          ]
        }
      ]
    },
    features: {
      keyFeatures: [
        'Classic Minesweeper gameplay with modern interface',
        'Multiple difficulty levels for all skill levels',
        'Custom game creation with personalized settings',
        'Timer and counter for competitive play',
        'Hint system for learning and assistance',
        'Statistics tracking and improvement monitoring'
      ],
      modes: [
        'Beginner - 9x9 grid with 10 mines',
        'Intermediate - 16x16 grid with 40 mines',
        'Expert - 30x16 grid with 99 mines',
        'Custom - Personalized grid size and mine count',
        'No Guessing Mode - Guaranteed solvable with logic'
      ],
      platforms: ['Web Browser', 'Windows', 'Mac', 'iOS', 'Android'],
      technical: [
        'Advanced mine placement algorithms',
        'Guaranteed solvable puzzles in certain modes',
        'Responsive design for all device sizes',
        'Smooth animations and visual feedback',
        'Auto-save functionality for interrupted games'
      ],
      social: [
        'Compete on global leaderboards',
        'Share your best completion times',
        'Challenge friends to beat your scores',
        'Participate in Minesweeper tournaments'
      ]
    },
    strategy: {
      beginners: [
        'Start with corners and edges - they have fewer adjacent squares',
        'Look for patterns like 1-2-1 and 1-2-2-1',
        'When completely stuck, make an educated guess in the safest area',
        'Use flags to mark definite mines and prevent accidental clicks',
        'Take your time - speed comes with practice'
      ],
      advanced: [
        'Master complex pattern recognition techniques',
        'Calculate probabilities for uncertain situations',
        'Use the process of elimination systematically',
        'Recognize when multiple patterns overlap',
        'Develop a mental model of the entire minefield'
      ],
      expert: [
        'Solve expert puzzles in under 100 seconds consistently',
        'Master advanced techniques like chord clicking',
        'Complete games without using any flags for maximum efficiency',
        'Recognize and exploit complex mathematical patterns',
        'Achieve perfect win rates through superior logic'
      ],
      commonMistakes: [
        'Rushing and making careless clicks',
        'Ignoring obvious patterns and clues',
        'Placing flags without logical certainty',
        'Not using the auto-reveal feature efficiently',
        'Giving up too easily on complex situations'
      ]
    },
    variations: {
      variations: [
        {
          name: 'Hexsweeper',
          description: 'Hexagonal grid version with six-directional adjacency',
          differences: [
            'Hexagonal tiles instead of squares',
            'Six adjacent tiles instead of eight',
            'Different strategic considerations',
            'More complex pattern recognition'
          ]
        },
        {
          name: '3D Minesweeper',
          description: 'Three-dimensional minefield with multiple layers',
          differences: [
            'Cubic grid with multiple layers',
            '26 possible adjacent positions',
            'Extremely challenging gameplay',
            'Advanced spatial reasoning required'
          ]
        },
        {
          name: 'Speed Minesweeper',
          description: 'Fast-paced version with time pressure',
          differences: [
            'Limited time to make each move',
            'Bonus points for quick decisions',
            'Intense, adrenaline-fueled gameplay',
            'Requires quick pattern recognition'
          ]
        }
      ],
      customOptions: [
        {
          name: 'Grid Size',
          options: ['9x9', '16x16', '30x16', 'Custom'],
          default: '16x16'
        },
        {
          name: 'Mine Count',
          options: ['10', '40', '99', 'Custom'],
          default: '40'
        },
        {
          name: 'Question Marks',
          options: ['Enabled', 'Disabled'],
          default: 'Enabled'
        },
        {
          name: 'Guess-Free Mode',
          options: ['On', 'Off'],
          default: 'Off'
        }
      ]
    },
    funFacts: [
      'Minesweeper was originally created to teach computer mouse skills',
      'The world record for expert Minesweeper is under 40 seconds',
      'There are mathematical theorems about Minesweeper solvability',
      'The game has been used in AI research for logical reasoning',
      'Some patterns in Minesweeper are NP-complete to solve',
      'Professional Minesweeper players can solve expert puzzles 99% of the time'
    ],
    terminology: [
      { term: 'Chord Clicking', definition: 'Double-clicking on a revealed number to auto-reveal adjacent squares' },
      { term: 'Pattern Recognition', definition: 'Identifying common mine configurations based on number patterns' },
      { term: 'Safe Square', definition: 'A square that can be mathematically proven to be mine-free' },
      { term: 'Forced Move', definition: 'A situation where only one logical move is possible' },
      { term: 'Local Analysis', definition: 'Examining a small section of the board for immediate clues' }
    ]
  },
  seo: {
    title: 'Play Minesweeper Classic Online Free - Best Logic Game',
    description: 'Play Minesweeper Classic online free! Use logic and strategy to avoid mines. Perfect puzzle game for brain training. No download required.',
    keywords: ['minesweeper', 'logic game', 'puzzle game', 'brain game', 'minesweeper classic', 'online minesweeper', 'strategy game'],
    ogTitle: 'Play Minesweeper Classic Online Free',
    ogDescription: 'Play the best Minesweeper Classic logic game online free. Train your brain!',
    ogImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=630&fit=crop'
  }
};