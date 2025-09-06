/**
 * 游戏内容配置总索引
 * 导出所有游戏的详细配置
 */

import { game2048Config } from './games/2048';
import { gameSolitaireConfig } from './games/solitaire';
import { gameMinesweeperConfig } from './games/minesweeper';
import { GameContentConfigs } from '../game-content';

export const gameContentConfigs: GameContentConfigs = {
  '2048': game2048Config,
  'solitaire-classic': gameSolitaireConfig,
  'minesweeper-classic': gameMinesweeperConfig,
};

// 根据游戏slug获取配置的辅助函数
export function getGameContentConfig(gameSlug: string) {
  return gameContentConfigs[gameSlug] || null;
}

// 获取所有可用游戏列表
export function getAllGameContentConfigs() {
  return Object.values(gameContentConfigs);
}

// 根据分类获取游戏
export function getGamesByCategory(category: string) {
  return Object.values(gameContentConfigs).filter(
    config => config.category.toLowerCase() === category.toLowerCase()
  );
}

// 搜索游戏
export function searchGames(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(gameContentConfigs).filter(config =>
    config.gameName.toLowerCase().includes(lowercaseQuery) ||
    config.content.about.description.toLowerCase().includes(lowercaseQuery) ||
    config.content.about.genre.some(genre => 
      genre.toLowerCase().includes(lowercaseQuery)
    )
  );
}

export default gameContentConfigs;