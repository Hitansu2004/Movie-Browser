"use client";

import { useFetch, Movie, TMDBResponse } from "@/hooks/useFetch";
import { Card, CardSkeleton } from "./Card";
import { motion, AnimatePresence } from "framer-motion";
import { Film, AlertCircle, Loader2, Star, TrendingUp, Calendar, Filter, BarChart3 } from "lucide-react";
import { Pagination, PageJumper } from "./Pagination";
import { GenreFilter } from "./GenreFilter";
import AdvancedFilters, { FilterState } from "./AdvancedFilters";
import { useState, useEffect } from "react";

interface MovieListProps {
  apiPath: string;
  title: string;
  showPagination?: boolean;
}

export const MovieList = ({ apiPath, title, showPagination = true }: MovieListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    search: '',
    yearRange: { min: 1900, max: new Date().getFullYear() },
    minRating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  const { data: response, loading, error } = useFetch(apiPath, "", currentPage);
  
  // Handle both paginated and non-paginated responses
  const isPagedResponse = (data: TMDBResponse | Movie[]): data is TMDBResponse => {
    return typeof data === 'object' && 'results' in data && 'total_pages' in data;
  };

  const movies = isPagedResponse(response) ? response.results : (Array.isArray(response) ? response : []);
  const totalPages = isPagedResponse(response) ? Math.min(response.total_pages, 500) : 1; // TMDB limit

  // Apply all filters
  const filteredMovies = movies.filter(movie => {
    // Genre filter
    const genreMatch = selectedGenres.length === 0 || 
      selectedGenres.every(genreId => movie.genre_ids.includes(genreId));
    
    // Search filter
    const searchMatch = advancedFilters.search === '' || 
      movie.title.toLowerCase().includes(advancedFilters.search.toLowerCase());
    
    // Year filter
    const movieYear = new Date(movie.release_date).getFullYear();
    const yearMatch = movieYear >= advancedFilters.yearRange.min && 
      movieYear <= advancedFilters.yearRange.max;
    
    // Rating filter
    const ratingMatch = movie.vote_average >= advancedFilters.minRating;
    
    return genreMatch && searchMatch && yearMatch && ratingMatch;
  });

  // Sort movies using advanced filters
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const multiplier = advancedFilters.sortOrder === 'desc' ? -1 : 1;
    
    switch (advancedFilters.sortBy) {
      case 'rating':
        return (b.vote_average - a.vote_average) * multiplier;
      case 'release_date':
        return (new Date(b.release_date).getTime() - new Date(a.release_date).getTime()) * multiplier;
      case 'title':
        return a.title.localeCompare(b.title) * multiplier;
      case 'popularity':
      default:
        return (b.popularity - a.popularity) * multiplier;
    }
  });

  // Calculate statistics
  const totalMoviesFromAPI = isPagedResponse(response) ? response.total_results : movies.length;
  const stats = {
    totalMovies: totalMoviesFromAPI, // Use total from API, not just current page
    averageRating: filteredMovies.length > 0 
      ? (filteredMovies.reduce((sum: number, movie: Movie) => sum + movie.vote_average, 0) / filteredMovies.length).toFixed(1)
      : '0.0',
    recentMovies: filteredMovies.filter((movie: Movie) => 
      new Date(movie.release_date).getFullYear() >= new Date().getFullYear() - 1
    ).length,
    highRatedMovies: filteredMovies.filter((movie: Movie) => movie.vote_average >= 7.5).length
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold gradient-text mb-4"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Loading amazing movies for you...
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="inline-block mb-4"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold gradient-text mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            Discover the best movies in cinema
          </motion.p>
        </motion.section>

        {/* Statistics & Controls */}
        <AnimatePresence>
          {showStats && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Collection Statistics
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalMovies.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Movies</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                  >
                    <div className="flex items-center justify-center text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      <Star className="w-5 h-5 mr-1" />
                      {stats.averageRating}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.highRatedMovies}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Highly Rated</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                  >
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.recentMovies}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Recent</div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Sort and Filter Controls */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-4"
        >
          {/* Sort Controls - Now moved to Advanced Filters */}

          {/* Filters */}
          <div className="space-y-4">
            {/* Genre Filter */}
            <div className="flex justify-start">
              <GenreFilter 
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
              />
            </div>
            
            {/* Advanced Filters */}
            <AdvancedFilters 
              currentFilters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
            />
          </div>
        </motion.section>

        {/* Show Stats Button */}
        {!showStats && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowStats(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show Statistics
          </motion.button>
        )}

        {/* Movie Grid */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 mb-12 justify-items-center"
        >
          <AnimatePresence mode="sync">
            {sortedMovies.map((movie, index) => (
              <motion.div
                key={`${movie.id}-${currentPage}`}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                }}
                layout
                className="w-full max-w-sm"
              >
                <Card movie={movie} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            
            <div className="flex justify-center mt-4">
              <PageJumper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </motion.section>
        )}

        {/* Footer Attribution */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-8 mt-16 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {movies.length} of {stats.totalMovies.toLocaleString()} movies
            {showPagination && totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Powered by TMDB • Developed with ❤️ by{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Hitansu Parichha
            </span>
          </p>
        </motion.footer>
      </main>
    </div>
  );
};
