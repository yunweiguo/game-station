'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Maximize, Minimize, RefreshCw } from 'lucide-react';

interface GameIframeProps {
  game: {
    id: string;
    name: string;
    iframe_url: string;
    slug: string;
  };
}

export function GameIframe({ game }: GameIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasRecordedPlay, setHasRecordedPlay] = useState(false);

  // 记录游戏播放统计和游戏历史
  useEffect(() => {
    if (!hasRecordedPlay && game.id) {
      const recordPlay = async () => {
        try {
          // 记录游戏统计
          await fetch('/api/games/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId: game.id,
              action: 'play'
            }),
          });

          // 记录游戏历史
          await fetch('/api/user/game-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId: game.id,
              playDuration: 0
            }),
          });

          setHasRecordedPlay(true);
        } catch (error) {
          console.error('Error recording game play:', error);
        }
      };

      recordPlay();
    }
  }, [game.id, hasRecordedPlay]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshGame = () => {
    setIsLoading(true);
    const iframe = document.getElementById(`game-iframe-${game.id}`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* Game Controls */}
      <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-5 h-5" />
          <span className="font-medium">{game.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={refreshGame}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title="Refresh game"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
      )}
      
      {/* Game iframe */}
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <iframe
          id={`game-iframe-${game.id}`}
          src={game.iframe_url}
          className={`absolute inset-0 w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={`Play ${game.name}`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
        />
      </div>
      
      {/* Game Instructions */}
      <div className="bg-gray-50 p-4 border-t">
        <h3 className="font-semibold text-gray-900 mb-2">How to Play</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use your mouse and keyboard to control the game</li>
          <li>• Click the fullscreen button for better experience</li>
          <li>• Press ESC to exit fullscreen mode</li>
          <li>• If the game doesn&apos;t load, try refreshing</li>
        </ul>
      </div>
    </div>
  );
}