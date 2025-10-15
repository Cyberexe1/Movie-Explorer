# 🎬 CineVault - Your Ultimate Movie Discovery Platform

A modern, sophisticated movie discovery web application built with Next.js 14, TypeScript, and Tailwind CSS. Discover, explore, and curate your perfect movie collection with an intuitive and beautiful interface.

## ✨ Features

- **🔐 Authentication System**: NextAuth.js with secure login and registration
- **🎬 Movie Discovery**: Browse popular movies from TMDB API
- **🔍 Search Functionality**: Find movies by title with search history
- **📄 Movie Details**: View comprehensive movie information
- **❤️ Favorites Management**: Add/remove movies from your favorites
- **📱 Responsive Design**: Optimized for all device sizes
- **🌙 Dark Mode**: Toggle between light and dark themes
- **♾️ Infinite Scrolling**: Load more movies seamlessly
- **🛡️ Protected Routes**: Middleware-based route protection
- **💾 Session Persistence**: Cookies + localStorage for enhanced UX

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: The Movie Database (TMDB)
- **State Management**: React Context API
- **Storage**: Local Storage (for demo purposes)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cinevault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   ```

4. **Get TMDB API Key**
   - Visit [TMDB](https://www.themoviedb.org/)
   - Create an account
   - Go to Settings > API
   - Request an API key
   - Copy the API key to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (movie listing)
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── movie/[id]/        # Movie details page
│   ├── favorites/         # Favorites page
│   └── search/            # Search results page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   ├── MovieCard.tsx      # Movie card component
│   └── LoadingSkeleton.tsx # Loading states
├── lib/                   # Utilities and configurations
│   ├── types.ts           # TypeScript type definitions
│   ├── tmdb.ts            # TMDB API client
│   ├── auth-context.tsx   # Authentication context
│   ├── theme-context.tsx  # Theme management
│   └── favorites.ts       # Favorites management
```

## 🎯 Key Features Implementation

### Authentication
- **NextAuth.js** with credentials provider
- **Secure password hashing** with bcryptjs
- **Protected routes** with middleware-based authentication
- **Session persistence** using secure HTTP-only cookies
- **Additional user data** stored in localStorage for UX enhancement
- **Automatic session cleanup** and expiration handling
- **Route protection** - only authenticated users can access main features

### Movie Data
- TMDB API integration for movie data
- Popular movies listing with pagination
- Movie search functionality
- Detailed movie information pages

### User Experience
- Responsive design for all screen sizes
- Dark/light theme toggle
- Loading skeletons for better UX
- Infinite scrolling for movie lists
- Favorites management with local storage

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production
Make sure to add these in your deployment platform:
```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Movies**: View popular movies on the homepage
3. **Search**: Use the search bar to find specific movies
4. **View Details**: Click on any movie to see detailed information
5. **Manage Favorites**: Add/remove movies from your favorites list
6. **Theme Toggle**: Switch between light and dark modes

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/app/globals.css` for global styles
- Customize component styles in individual files

### API Integration
- Extend `src/lib/tmdb.ts` for additional TMDB endpoints
- Add new movie-related features
- Implement additional data sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please respect TMDB's terms of service when using their API.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons