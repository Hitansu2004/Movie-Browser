# 🎬 Cinemate - Advanced Movie Browser

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss)

**A modern, feature-rich movie discovery platform built with Next.js**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🎯 Features](#features) • [⚡ Quick Start](#getting-started)

</div>

---

## 📸 Preview

### 🏠 Home Page
![Home Page](https://via.placeholder.com/800x400/1a202c/ffffff?text=Cinemate+Home+Page)
*Beautiful hero section with personalized movie recommendations*

### 🎬 Movie Discovery
![Movie Grid](https://via.placeholder.com/800x400/2d3748/ffffff?text=Movie+Grid+with+Advanced+Filters)
*Advanced filtering and search capabilities with real-time results*

### 📱 Mobile Experience
![Mobile View](https://via.placeholder.com/400x600/4a5568/ffffff?text=Mobile+Responsive+Design)
*Fully responsive design optimized for all devices*

---

## ✨ Features

### 🎯 **Movie Discovery**
- 🎬 **Browse Categories**: Now Playing, Popular, Top Rated, Upcoming
- 🔍 **Instant Search**: Real-time search with 300ms debouncing
- 🎛️ **Advanced Filtering**: Filter by genre, year range, and ratings
- 📊 **Smart Sorting**: Sort by popularity, rating, release date, or title
- 🎭 **Genre System**: Visual genre badges with intelligent color coding

### 🎥 **Trailer Integration**
- ▶️ **Watch Trailers**: YouTube trailer integration with modal player
- 🔇 **Smart Controls**: Auto-mute with manual control options
- 📱 **Responsive Player**: Optimized for all screen sizes

### 🤖 **Recommendation Engine**
- ✨ **For You Section**: Personalized movie recommendations
- 🎯 **Similar Movies**: AI-powered similar movie suggestions
- 📈 **Trending Content**: Weekly trending movies
- ⭐ **Highly Rated**: Top-rated movies in similar genres

### 🎨 **User Experience**
- 🌙 **Dark/Light Mode**: Seamless theme switching
- 📱 **Mobile First**: Responsive design for all devices
- ⚡ **Lightning Fast**: Optimized performance with Next.js SSR
- � **Accessibility**: WCAG compliant with keyboard navigation
- 🎪 **Smooth Animations**: Professional transitions with Framer Motion

### 📊 **Statistics & Analytics**
- 📈 **Collection Stats**: Total movies, average ratings, trending data
- � **Real-time Counts**: Live statistics from TMDB API
- 📱 **Filter Analytics**: See how filters affect results

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **Animations**: Framer Motion
- **Icons**: Lucide React

### **Data & API**
- **Movie Data**: The Movie Database (TMDB) API
- **Image Optimization**: Next.js Image component
- **Caching**: Next.js built-in caching

### **Development**
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode

---

## ⚡ Getting Started

### 📋 Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))

### 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hitansu2004/MOVIE-BROWSER.git
   cd MOVIE-BROWSER
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality |

---

## 📁 Project Structure

```
📦 MOVIE-BROWSER/
├── 📂 src/
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── 📂 movie/[id]/         # Dynamic movie detail pages
│   │   ├── 📂 movies/             # Movie category pages
│   │   │   ├── popular/
│   │   │   ├── top/
│   │   │   └── upcoming/
│   │   ├── 📂 search/             # Search functionality
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── not-found.tsx          # 404 page
│   ├── 📂 components/             # Reusable components
│   │   ├── AdvancedFilters.tsx    # Advanced filtering system
│   │   ├── Card.tsx               # Movie card component
│   │   ├── ForYouRecommendations.tsx # Personalized recommendations
│   │   ├── GenreBadges.tsx        # Genre display system
│   │   ├── GenreFilter.tsx        # Genre filtering
│   │   ├── Header.tsx             # Navigation header
│   │   ├── MovieList.tsx          # Movie grid component
│   │   ├── Pagination.tsx         # Pagination controls
│   │   ├── RecommendationEngine.tsx # AI recommendations
│   │   ├── TrailerButton.tsx      # Trailer integration
│   │   └── TrailerModal.tsx       # Trailer player modal
│   ├── 📂 hooks/                  # Custom React hooks
│   │   └── useFetch.ts            # API data fetching
│   └── 📂 utils/                  # Utility functions
│       └── genres.ts              # Genre utilities
├── 📂 public/                     # Static assets
├── 📄 package.json               # Dependencies
├── 📄 next.config.js             # Next.js configuration
├── 📄 tailwind.config.ts         # Tailwind CSS config
└── 📄 tsconfig.json              # TypeScript config
```

---

## 🎯 Key Features Breakdown

### 🔍 **Advanced Search System**
- **Instant Results**: Real-time search with debouncing
- **Smart Suggestions**: Popular search recommendations
- **Multiple Filters**: Genre, year, rating combinations
- **Keyboard Shortcuts**: `Ctrl/Cmd + K` to focus search

### 🎬 **Trailer Integration**
- **One-Click Play**: Instant trailer access on every movie
- **YouTube Integration**: High-quality trailer streaming
- **Smart Loading**: Lazy loading for better performance
- **Error Handling**: Graceful fallbacks for missing trailers

### 🤖 **Recommendation Engine**
- **Similar Movies**: Based on genres and themes
- **Personalized Picks**: TMDB's recommendation algorithm
- **Trending Content**: Weekly trending movies
- **Smart Discovery**: Genre-based top-rated suggestions

---

## 🌐 API Integration

This application integrates with [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for:

- **Movie Data**: Titles, descriptions, ratings, cast
- **Images**: Posters, backdrops, profile pictures
- **Videos**: Trailers, clips, behind-the-scenes
- **Recommendations**: Similar movies, trending content

### API Endpoints Used:
- `/movie/now_playing` - Currently playing movies
- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/discover/movie` - Advanced movie discovery
- `/movie/{id}/videos` - Movie trailers
- `/movie/{id}/similar` - Similar movies
- `/movie/{id}/recommendations` - Personalized recommendations

---

## 🚀 Deployment

### **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hitansu2004/MOVIE-BROWSER)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically with each push

### **Manual Deployment**
```bash
npm run build
npm run start
```

### **Environment Variables**
Set these in your deployment platform:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key
```

---

## 🎨 Customization

### **Themes**
The app supports both light and dark themes with automatic detection of user preference.

### **Colors**
Customize the color scheme by modifying `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* your primary colors */ },
  secondary: { /* your secondary colors */ }
}
```

### **Layout**
Adjust grid layouts and responsive breakpoints in component files.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hitansu Parichha**
- GitHub: [@Hitansu2004](https://github.com/Hitansu2004)
- Project: [MOVIE-BROWSER](https://github.com/Hitansu2004/MOVIE-BROWSER)

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/Hitansu2004/MOVIE-BROWSER?style=social)](https://github.com/Hitansu2004/MOVIE-BROWSER/stargazers)

</div>
