# Game Station Template - SEO Optimized Game Website Template

A powerful, SEO-optimized game website template built with Next.js 15, designed for quickly deploying game-specific landing pages that can rank for targeted keywords.

## 🎯 Features

- **SEO Optimized**: Built-in SEO components with structured data, Open Graph tags, and meta tags
- **Template-Based**: Easy to configure for different games with simple configuration changes
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **Performance Optimized**: Fast loading with Next.js 15 and optimized images
- **Ready to Deploy**: Includes authentication, database, and admin panel
- **Multi-language Support**: Built-in internationalization (i18n) support

## 🚀 Quick Start

### 1. Configure Your Game

Edit `src/config/homepage.ts` and change the `currentConfig`:

```typescript
// Switch to different games
export const currentConfig = gameConfigs['2048'];        // 2048 Game
export const currentConfig = gameConfigs['solitaire'];   // Solitaire
export const currentConfig = gameConfigs['minesweeper'];  // Minesweeper
```

### 2. Update Game Information

Update the following in the configuration:
- Game name and description
- SEO title, description, keywords
- Game instructions and tips
- Game URL and thumbnail

### 3. Deploy to New Domain

- Copy the project to a new directory
- Update the configuration for your target game
- Deploy to your new domain

## 📁 Project Structure

```
src/
├── config/
│   └── homepage.ts          # Main configuration file
├── app/[locale]/
│   └── page.tsx            # Homepage with featured game
├── components/
│   ├── SEO.tsx             # SEO component
│   ├── GameCard.tsx        # Game cards
│   └── GameIframe.tsx      # Game player
└── lib/
    ├── games.ts            # Game data
    └── auth.ts             # Authentication
```

## 🎮 Game Configuration

### Adding New Games

1. Add new game configuration in `src/config/homepage.ts`:

```typescript
export const gameConfigs = {
  'your-game': {
    featuredGame: {
      id: 'your-game-id',
      name: 'Your Game Name',
      description: 'Game description...',
      iframe_url: 'https://your-game-url.com',
      // ... other game settings
    },
    seo: {
      title: 'Play Your Game Online Free',
      description: 'SEO description...',
      keywords: ['game', 'online', 'free'],
      // ... other SEO settings
    },
    content: {
      heroTitle: 'Play Your Game Online Free',
      gameInstructions: ['Step 1...', 'Step 2...'],
      // ... other content settings
    }
  }
}
```

2. Set as current configuration:

```typescript
export const currentConfig = gameConfigs['your-game'];
```

## 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **Deployment**: Vercel/Netlify ready

## 📱 Page Structure

### Homepage Sections
1. **Hero Section**: Featured game with call-to-action
2. **Game Instructions**: How to play guide
3. **Pro Tips**: Strategy tips and tricks
4. **Game Features**: Key selling points
5. **Other Games**: Additional game recommendations
6. **Final CTA**: Last call-to-action

### SEO Features
- Structured data (JSON-LD)
- Open Graph tags
- Twitter Card tags
- Meta tags optimization
- Canonical URLs
- Responsive design

## 🎨 Customization

### Colors and Styling
- Update colors in `tailwind.config.js`
- Modify CSS variables in `globals.css`
- Customize component styles

### Content
- Edit game instructions in the configuration
- Update SEO metadata
- Customize calls-to-action

### Layout
- Modify homepage sections in `src/app/[locale]/page.tsx`
- Update component layouts
- Add new sections as needed

## 🚀 Deployment

### Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your-database-url
```

## 📈 SEO Best Practices

1. **Keyword Research**: Target specific game-related keywords
2. **Content Quality**: Provide valuable game instructions and tips
3. **Page Speed**: Optimize images and use CDN
4. **Mobile Optimization**: Ensure perfect mobile experience
5. **Structured Data**: Use included JSON-LD markup
6. **Meta Tags**: Customize for each game

## 🔍 Troubleshooting

### Common Issues
- **Game not loading**: Check iframe URL in configuration
- **SEO not working**: Verify SEO component is included
- **Styles broken**: Run `npm install` to install dependencies
- **Build errors**: Check TypeScript types and imports

## 📄 License

This project is for educational and commercial use. Please ensure you have rights to use any games or content you feature.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the configuration examples
- Ensure all dependencies are installed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

**Built with ❤️ for game developers and SEO specialists**
