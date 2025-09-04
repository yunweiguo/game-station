export function generateGamePlaceholder(gameName: string, color: string = '#6366f1'): string {
  // Create a clean SVG placeholder with game name
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="${color}"/>
      <text x="150" y="100" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">
        ${gameName}
      </text>
      <text x="150" y="130" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em" opacity="0.8">
        Game Preview
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function generateCategoryPlaceholder(categoryName: string, icon: string, color: string = '#6366f1'): string {
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="${color}"/>
      <text x="150" y="80" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dy=".3em">
        ${icon}
      </text>
      <text x="150" y="130" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">
        ${categoryName}
      </text>
      <text x="150" y="155" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em" opacity="0.8">
        Category
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const gameColors = [
  '#6366f1', // indigo
  '#ef4444', // red
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

export function getRandomGameColor(): string {
  return gameColors[Math.floor(Math.random() * gameColors.length)];
}