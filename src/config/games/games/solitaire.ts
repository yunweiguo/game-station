import { GameContentConfig } from '../../game-content';

export const gameSolitaireConfig: GameContentConfig = {
  gameSlug: 'solitaire-classic',
  gameName: 'Solitaire Classic',
  category: 'Card Games',
  breadcrumbs: {
    category: 'Card Games',
    gameName: 'Solitaire Classic'
  },
  content: {
    about: {
      title: 'About Solitaire Classic',
      description: 'Solitaire Classic, also known as Klondike Solitaire, is the most popular patience card game in the world. This timeless single-player card game has been a favorite pastime for generations, offering the perfect blend of strategy, luck, and relaxation.',
      developer: 'Traditional Game',
      releaseYear: 1780,
      genre: ['Card Game', 'Patience', 'Strategy', 'Brain Training'],
      background: 'Solitaire originated in Northern Europe and became popular in the 19th century. The digital version helped make it one of the most played computer games of all time. Microsoft included Solitaire with Windows in 1990, introducing millions of people to this classic card game.',
      difficulty: 'easy',
      audience: 'all'
    },
    howToPlay: {
      objective: 'Build four foundation piles up in suit from Ace to King, and move all cards from the tableau to win.',
      setup: [
        'Standard 52-card deck is used',
        '28 cards are dealt to 7 tableau columns (1, 2, 3, 4, 5, 6, 7 cards respectively)',
        'Only the top card of each column is face up',
        'Remaining 24 cards form the stock pile',
        'Four foundation piles start empty'
      ],
      gameplay: [
        'Build tableau columns down in alternating colors (red on black, black on red)',
        'Move face-up cards between tableau columns following the alternating color rule',
        'Only Kings can be placed in empty tableau columns',
        'Click the stock to deal one card at a time to the waste pile',
        'Build foundation piles up by suit from Ace to King'
      ],
      rules: [
        'Tableau builds down in alternating colors',
        'Foundations build up by suit',
        'Only one card can be moved at a time (unless using sequences)',
        'Empty tableau columns can only be filled with Kings',
        'When stock is exhausted, it may be reused'
      ],
      scoring: [
        '10 points for each card moved to foundation',
        '5 points for each card moved from waste to tableau',
        '-15 points for each card moved from foundation to tableau',
        'Bonus points for completing the game quickly',
        'Time bonus for faster completion'
      ],
      winConditions: [
        'All 52 cards moved to foundation piles in suit order',
        'Each foundation pile contains all 13 cards of one suit',
        'Ace through King sequence completed for all four suits'
      ],
      controls: [
        {
          type: 'mouse',
          actions: [
            { input: 'Click Card', action: 'Select or move card' },
            { input: 'Double Click', action: 'Auto-move to foundation' },
            { input: 'Drag & Drop', action: 'Move card or sequence' }
          ]
        },
        {
          type: 'keyboard',
          actions: [
            { input: 'Space', action: 'Deal from stock' },
            { input: 'U', action: 'Undo last move' },
            { input: 'H', action: 'Get hint' }
          ]
        },
        {
          type: 'touch',
          actions: [
            { input: 'Tap Card', action: 'Select or move card' },
            { input: 'Double Tap', action: 'Auto-move to foundation' },
            { input: 'Swipe', action: 'Scroll through long sequences' }
          ]
        }
      ]
    },
    features: {
      keyFeatures: [
        'Classic Klondike Solitaire gameplay',
        'Intuitive drag-and-drop interface',
        'Unlimited undo functionality',
        'Helpful hints and auto-complete',
        'Beautiful card designs and animations',
        'Statistics tracking and best scores'
      ],
      modes: [
        'Draw 1 - Easier, more strategic gameplay',
        'Draw 3 - Traditional, more challenging',
        'Vegas Scoring - Casino-style scoring system',
        'Timed Mode - Race against the clock',
        'Relax Mode - No time pressure'
      ],
      platforms: ['Web Browser', 'Windows', 'Mac', 'iOS', 'Android'],
      technical: [
        'Smooth card animations and transitions',
        'Auto-save game progress',
        'Multiple card back designs',
        'Responsive layout for all screen sizes',
        'Offline play capability'
      ],
      social: [
        'Share your best times and scores',
        'Compete in daily challenges',
        'Track your improvement over time',
        'Compare stats with other players'
      ]
    },
    strategy: {
      beginners: [
        'Always move Aces and Deuces to foundations immediately',
        'Try to expose face-down cards as quickly as possible',
        'Build longer sequences in the tableau for more move options',
        'Think several moves ahead before making a decision',
        'Use the undo feature to experiment with different moves'
      ],
      advanced: [
        'Create empty tableau columns strategically for Kings',
        'Balance between building foundations and maintaining tableau mobility',
        'Plan the order of moving cards to maximize options',
        'Learn to recognize when to hold back on obvious moves',
        'Manage the stock pile efficiently for endgame scenarios'
      ],
      expert: [
        'Calculate optimal move sequences for maximum scoring',
        'Master complex multi-card planning and execution',
        'Achieve perfect scores in all game modes',
        'Complete games in minimum time records',
        'Win consistently in the most challenging configurations'
      ],
      commonMistakes: [
        'Moving cards to foundations too quickly',
        'Creating situations with no legal moves',
        'Focusing only on short-term gains',
        'Ignoring the potential of empty columns',
        'Not planning stock pile usage for endgame'
      ]
    },
    variations: {
      variations: [
        {
          name: 'Spider Solitaire',
          description: 'Two-deck variation with more complex strategy',
          differences: [
            'Uses two standard decks (104 cards)',
            'Build sequences in suit (King to Ace)',
            'Complete sequences are automatically removed',
            'More complex planning required'
          ]
        },
        {
          name: 'FreeCell',
          description: 'All cards visible from the start with free cells',
          differences: [
            'All cards dealt face-up at start',
            'Four free cells for temporary storage',
            'More strategic depth and planning',
            'Almost every game is winnable with skill'
          ]
        },
        {
          name: 'Pyramid Solitaire',
          description: 'Remove pairs of cards that add up to 13',
          differences: [
            'Pyramid-shaped card layout',
            'Remove pairs totaling 13 points',
            'Different strategic considerations',
            'More luck-based gameplay'
          ]
        }
      ],
      customOptions: [
        {
          name: 'Draw Count',
          options: ['Draw 1', 'Draw 3'],
          default: 'Draw 1'
        },
        {
          name: 'Scoring Mode',
          options: ['Standard', 'Vegas', 'None'],
          default: 'Standard'
        },
        {
          name: 'Timer',
          options: ['On', 'Off'],
          default: 'On'
        },
        {
          name: 'Difficulty',
          options: ['Easy', 'Medium', 'Hard'],
          default: 'Medium'
        }
      ]
    },
    funFacts: [
      'Solitaire was included with Windows to teach mouse manipulation',
      'The game is believed to have originated in the Baltic region',
      'Microsoft Solitaire is one of the most played computer games ever',
      'Studies show Solitaire can help reduce stress and improve focus',
      'The term "patience" is used in British English for solitaire games',
      'Professional solitaire tournaments exist with cash prizes'
    ],
    terminology: [
      { term: 'Tableau', definition: 'The main playing area with 7 columns of cards' },
      { term: 'Foundation', definition: 'The four piles where cards are built up by suit' },
      { term: 'Stock', definition: 'The remaining cards not yet dealt to the tableau' },
      { term: 'Waste', definition: 'Cards dealt from the stock but not yet played' },
      { term: 'King\'s Corner', definition: 'Strategy of keeping empty columns for Kings' }
    ]
  },
  seo: {
    title: 'Play Solitaire Classic Online Free - Best Card Game',
    description: 'Play Solitaire Classic online free! The most popular patience card game. Perfect for brain training and relaxation. No download required.',
    keywords: ['solitaire', 'card game', 'patience', 'solitaire classic', 'online solitaire', 'free solitaire', 'klondike'],
    ogTitle: 'Play Solitaire Classic Online Free',
    ogDescription: 'Play the best Solitaire Classic card game online free. Perfect for brain training!',
    ogImage: 'https://images.unsplash.com/photo-1550466561-4a3b5d3b0b0d?w=1200&h=630&fit=crop'
  }
};