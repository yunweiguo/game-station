'use client';

import { Calendar, User, Target, Gamepad2, Trophy, Settings, Lightbulb, Star } from 'lucide-react';
import { GameSpecificContent } from '@/config/game-content';

interface GameAboutProps {
  gameSlug: string;
  content: GameSpecificContent;
  breadcrumbs: {
    category: string;
    gameName: string;
  };
  className?: string;
}

export function GameAbout({ gameSlug, content, breadcrumbs, className = '' }: GameAboutProps) {
  console.log('GameAbout received:', { gameSlug, content, breadcrumbs });
  
  if (!content) {
    return <div>Error: Game content not found</div>;
  }
  
  // Safely extract content with fallbacks
  const { about, howToPlay, features, strategy, variations, funFacts, terminology } = content || {};
  
  console.log('Extracted content:', { about, howToPlay, features });
  
  // Validate required content exists
  if (!about || !howToPlay || !features) {
    return <div>Error: Incomplete game content configuration</div>;
  }

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div>
            <nav className="flex items-center space-x-2 text-sm">
              <span>{breadcrumbs.category}</span>
              <span>/</span>
              <span>{breadcrumbs.gameName}</span>
            </nav>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {about.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
              {about.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Developed by {about.developer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{about.releaseYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="capitalize">{about.difficulty}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {about.genre.map((genre) => (
                <span 
                  key={genre}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Game Overview */}
          <div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Game Overview</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objective
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{howToPlay.objective}</p>
                </div>

                {about.background && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Background
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{about.background}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Setup</h3>
                  <ul className="space-y-2">
                    {howToPlay.setup.slice(0, 3).map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Win Conditions</h3>
                  <ul className="space-y-2">
                    {howToPlay.winConditions.map((condition, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Trophy className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* How to Play */}
          <div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How to Play</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Gameplay</h3>
                  <ul className="space-y-2">
                    {howToPlay.gameplay.map((rule, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Key Rules</h3>
                  <ul className="space-y-2">
                    {howToPlay.rules.slice(0, 4).map((rule, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {howToPlay.scoring && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Scoring</h3>
                    <ul className="space-y-2">
                      {howToPlay.scoring.slice(0, 3).map((rule, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-700 text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Controls</h3>
                  <div className="space-y-3">
                    {howToPlay.controls.slice(0, 2).map((control, index) => (
                      <div key={index}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                          {control.type}
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {control.actions.slice(0, 2).map((action, actionIndex) => (
                            <div key={actionIndex} className="text-xs text-gray-600">
                              <span className="font-medium">{action.input}:</span> {action.action}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Features */}
          <div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">What Makes It Special</h3>
                  <ul className="space-y-2">
                    {features.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Game Modes</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.modes.map((mode) => (
                      <span key={mode} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Available Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.platforms.map((platform) => (
                      <span key={platform} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Technical Highlights</h3>
                  <ul className="space-y-2">
                    {features.technical?.slice(0, 3).map((tech, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 text-sm">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Section */}
        {strategy && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Pro Tips & Strategy</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {strategy.beginners && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">For Beginners</h3>
                    <ul className="space-y-3">
                      {strategy.beginners.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {strategy.advanced && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Strategy</h3>
                    <ul className="space-y-3">
                      {strategy.advanced.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {strategy.expert && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Expert Level</h3>
                    <ul className="space-y-3">
                      {strategy.expert.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {strategy.commonMistakes && (
                <div className="mt-8 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3">Common Mistakes to Avoid</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {strategy.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-red-700 text-sm">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
        )}

        {/* Game Variations */}
        {variations && variations.variations.length > 0 && (
          <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Game Variations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variations.variations.map((variation, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{variation.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{variation.description}</p>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Key Differences:</h4>
                      <ul className="space-y-1">
                        {variation.differences.slice(0, 3).map((difference, diffIndex) => (
                          <li key={diffIndex} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5"></span>
                            {difference}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* Fun Facts */}
        {funFacts && funFacts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fun Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funFacts.map((fact, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* Terminology */}
        {terminology && terminology.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Terminology</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {terminology.map((term, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{term.term}</h4>
                    <p className="text-gray-600 text-sm">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
        )}
      </div>
    </section>
  );
}