# Frederick Talks - Personal Website

A modern, responsive personal website built with Vite, Tailwind CSS, and Alpine.js. Features a clean design with smooth animations and a content management system using JSON files.

## ✨ Features

- **Modern Stack**: Vite + Tailwind CSS + Alpine.js
- **Responsive Design**: Mobile-first approach with beautiful layouts
- **Content Management**: Easy content editing via JSON files
- **Interactive Modal**: Contact form with smooth animations
- **Performance Optimized**: Fast loading and optimized builds
- **Vercel Ready**: Zero-config deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The page will auto-reload when you make changes

### Build for Production

```bash
npm run build
npm run preview  # Preview the build locally
```

## 📝 Content Management

### Editing Content

All content is managed through JSON files in the `src/data/` directory:

- **`content.json`**: Main website content (hero, about, contact sections)

### Content Structure

```json
{
  "hero": {
    "title": "Your Name",
    "subtitle": "Your Role", 
    "description": "Your description",
    "primaryCta": "Button text",
    "secondaryCta": "Button text"
  },
  "about": {
    "title": "Section title",
    "content": "Your about content",
    "skills": ["Skill 1", "Skill 2", "Skill 3"]
  }
}
```

### How It Works

1. **Edit** the JSON files in `src/data/`
2. **Save** your changes
3. **Refresh** the browser to see updates
4. Content is automatically injected into the HTML using data attributes

## 🎨 Customization

### Colors & Styling

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  'primary': {
    50: '#eff6ff',   // Light blue
    500: '#3b82f6',  // Medium blue  
    600: '#2563eb',  // Dark blue
    700: '#1d4ed8',  // Darker blue
  }
}
```

### Adding New Sections

1. **Add content** to `src/data/content.json`
2. **Create HTML** in `src/index.html` with `data-content` attributes
3. **Update JavaScript** in `src/scripts/main.js` to populate the content

## 📦 Project Structure

```
fredericktalks/
├── src/
│   ├── index.html          # Main HTML file
│   ├── styles/
│   │   └── main.css        # Tailwind + custom styles
│   ├── scripts/
│   │   └── main.js         # Alpine.js components
│   └── data/
│       └── content.json    # Website content
├── dist/                   # Build output
├── package.json
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── vercel.json           # Vercel deployment config
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Import your project**
3. **Deploy** - Vercel will automatically:
   - Detect the framework
   - Run `npm run build`
   - Deploy the `dist` folder

### Manual Deployment

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 🛠️ Technical Details

### Stack
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Alpine.js**: Lightweight JavaScript framework
- **PostCSS**: CSS processing

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- No IE support (uses modern JavaScript)

### Performance
- Optimized builds with Vite
- Minimal JavaScript bundle (~15kb Alpine.js)
- Efficient CSS with Tailwind's purging

## 🎯 Key Features Explained

### Modal System
- Built with Alpine.js
- Smooth animations with CSS transitions
- Accessible (keyboard navigation, focus management)
- Form validation included

### Content System
- JSON-based content management
- No database required
- Version control friendly
- Easy to edit and maintain

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible grid layouts
- Touch-friendly interactions

## 📞 Support

Need help customizing your website? Feel free to reach out!

---

Built with ❤️ using modern web technologies. 