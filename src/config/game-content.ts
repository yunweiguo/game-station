/**
 * 游戏特定内容配置的数据结构定义
 * 支持不同游戏的详细介绍、玩法和特色
 */

export interface GameAboutInfo {
  /** 游戏基本信息 */
  title: string;
  description: string;
  developer: string;
  releaseYear: number;
  genre: string[];
  /** 游戏背景故事 */
  background?: string;
  /** 游戏难度 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 适合年龄 */
  audience: 'all' | 'kids' | 'teens' | 'adults';
}

export interface GameHowToPlay {
  /** 游戏目标 */
  objective: string;
  /** 游戏设置 */
  setup: string[];
  /** 核心玩法 */
  gameplay: string[];
  /** 游戏规则 */
  rules: string[];
  /** 计分方式（可选） */
  scoring?: string[];
  /** 游戏结束条件 */
  winConditions: string[];
  /** 控制方式 */
  controls: Array<{
    type: 'keyboard' | 'mouse' | 'touch' | 'gesture';
    actions: Array<{
      input: string;
      action: string;
    }>;
  }>;
}

export interface GameFeatures {
  /** 核心特色 */
  keyFeatures: string[];
  /** 游戏模式 */
  modes: string[];
  /** 支持平台 */
  platforms: string[];
  /** 技术特色 */
  technical?: string[];
  /** 社交特色 */
  social?: string[];
}

export interface GameStrategy {
  /** 新手技巧 */
  beginners: string[];
  /** 进阶策略 */
  advanced: string[];
  /** 专家技巧 */
  expert?: string[];
  /** 常见错误 */
  commonMistakes?: string[];
}

export interface GameVariations {
  /** 游戏变体 */
  variations: Array<{
    name: string;
    description: string;
    differences: string[];
  }>;
  /** 自定义选项 */
  customOptions?: Array<{
    name: string;
    options: string[];
    default: string;
  }>;
}

export interface GameSpecificContent {
  /** 游戏介绍信息 */
  about: GameAboutInfo;
  /** 游戏玩法 */
  howToPlay: GameHowToPlay;
  /** 游戏特色 */
  features: GameFeatures;
  /** 游戏策略（可选） */
  strategy?: GameStrategy;
  /** 游戏变体（可选） */
  variations?: GameVariations;
  /** 有趣的事实 */
  funFacts?: string[];
  /** 相关术语 */
  terminology?: Array<{
    term: string;
    definition: string;
  }>;
}

export interface GameContentConfig {
  /** 游戏标识 */
  gameSlug: string;
  /** 游戏名称 */
  gameName: string;
  /** 游戏分类 */
  category: string;
  /** 面包屑配置 */
  breadcrumbs: {
    category: string;
    gameName: string;
  };
  /** 特定内容 */
  content: GameSpecificContent;
  /** SEO 配置 */
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

export type GameContentConfigs = Record<string, GameContentConfig>;