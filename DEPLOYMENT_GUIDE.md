# 游戏站模板项目快速部署指南

## 概述
这是一个专门为SEO优化的游戏站模板项目，可以快速部署针对不同游戏关键词的网站。

## 快速切换游戏步骤

### 1. 修改配置文件
编辑 `src/config/homepage.ts` 文件，修改 `currentConfig` 的值：

```typescript
// 切换到2048游戏
export const currentConfig = gameConfigs['2048'];

// 切换到纸牌接龙
export const currentConfig = gameConfigs['solitaire'];

// 切换到扫雷
export const currentConfig = gameConfigs['minesweeper'];
```

### 2. 更新SEO信息
在配置文件中更新以下信息：
- 游戏名称和描述
- SEO标题、描述、关键词
- 游戏介绍和攻略
- 游戏链接

### 3. 部署到新域名
- 复制整个项目到新目录
- 修改配置文件中的游戏信息
- 部署到新的域名

## 配置文件说明

### 主要配置项：
- `featuredGame`: 主推游戏信息
- `seo`: SEO元数据
- `content`: 页面内容（标题、介绍、攻略、特色）
- `otherGames`: 其他游戏展示配置
- `social`: 社交分享配置

### 添加新游戏：
```typescript
export const gameConfigs = {
  'your-game': {
    featuredGame: {
      // 游戏信息
    },
    seo: {
      // SEO信息
    },
    content: {
      // 页面内容
    }
  }
}
```

## 项目结构
```
src/
├── config/
│   └── homepage.ts          # 首页配置文件
├── app/[locale]/
│   └── page.tsx            # 首页
├── components/
│   ├── SEO.tsx             # SEO组件
│   ├── GameCard.tsx        # 游戏卡片
│   └── GameIframe.tsx      # 游戏播放器
└── lib/
    └── games.ts            # 游戏数据
```

## SEO优化特性

1. **结构化数据**: 内置JSON-LD结构化数据
2. **Open Graph**: 优化社交媒体分享
3. **响应式设计**: 适配所有设备
4. **快速加载**: 优化的性能和缓存
5. **内容丰富**: 游戏介绍、攻略、特色等内容

## 部署建议

1. **每个游戏一个域名**: 针对不同的游戏关键词使用不同的域名
2. **内容本地化**: 根据目标地区调整语言和内容
3. **监控和分析**: 添加Google Analytics等分析工具
4. **CDN加速**: 使用CDN加速图片和静态资源

## 注意事项

1. **游戏链接**: 确保配置的游戏链接是可用的
2. **图片资源**: 使用高质量的游戏截图
3. **内容质量**: 确保游戏介绍和攻略内容质量高
4. **移动端优化**: 确保在移动设备上体验良好

## 支持的游戏类型

- HTML5游戏
- iframe嵌入游戏
- WebGL游戏
- 经典街机游戏
- 益智游戏
- 策略游戏

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- NextAuth.js
- React 18

## 许可证

此项目仅用于学习和参考目的。请确保您有权利使用和分发所包含的游戏内容。