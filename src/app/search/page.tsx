"use client";

import { useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardSkeleton } from "@/components/Card";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Film, Filter, SortAsc, Star, Calendar, TrendingUp, X } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryTerm = searchParams.get("q") || "";
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryTerm);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [filterRating, setFilterRating] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: moviesData, loading, error } = useFetch("search/movie", searchQuery || queryTerm, 1);
  
  // Extract movies array from the response
  const movies = Array.isArray(moviesData) ? moviesData : moviesData?.results || [];

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    // Apply rating filter
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(movie => movie.vote_average >= minRating);
    }

    // Apply year filter
    if (filterYear) {
      filtered = filtered.filter(movie => {
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear.toString() === filterYear;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity.desc":
          return (b.popularity || 0) - (a.popularity || 0);
        case "vote_average.desc":
          return (b.vote_average || 0) - (a.vote_average || 0);
        case "release_date.desc":
          return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        case "title.asc":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, sortBy, filterRating, filterYear]);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = movies
      .map(movie => new Date(movie.release_date).getFullYear())
      .filter(year => !isNaN(year))
      .sort((a, b) => b - a);
    return [...new Set(years)];
  }, [movies]);

  useEffect(() => {
    setMounted(true);
    if (queryTerm) {
      document.title = `Search result for ${queryTerm} / Cinemate`;
    }
  }, [queryTerm]);

  useEffect(() => {
    setSearchQuery(queryTerm);
  }, [queryTerm]);

  // Handle instant search with debouncing
  useEffect(() => {
    if (mounted && searchQuery !== queryTerm) {
      const timer = setTimeout(() => {
        if (searchQuery.trim()) {
          window.history.pushState(null, "", `/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, queryTerm, mounted]);

  const clearFilters = () => {
    setFilterRating("");
    setFilterYear("");
    setSortBy("popularity.desc");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 py-8 md:px-8 lg:px-16">
        {/* Enhanced Header with Instant Search */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Search className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Search Movies
            </h1>
          </div>

          {/* Instant Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies... (instant results)"
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X />
                </button>
              )}
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Newest First</option>
              <option value="title.asc">Title A-Z</option>
            </select>

            {(filterRating || filterYear) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Minimum Rating
                    </label>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    >
                      <option value="">Any Rating</option>
                      <option value="7">7.0+ Excellent</option>
                      <option value="6">6.0+ Good</option>
                      <option value="5">5.0+ Average</option>
                      <option value="4">4.0+ Below Average</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      Release Year
                    </label>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    >
                      <option value="">Any Year</option>
                      {availableYears.slice(0, 20).map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results Info */}
          {searchQuery && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {filteredAndSortedMovies.length > 0 ? (
                <>
                  Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredAndSortedMovies.length}</span> 
                  {filteredAndSortedMovies.length !== movies.length && (
                    <> of {movies.length}</>
                  )} results for <span className="font-semibold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                </>
              ) : movies.length > 0 ? (
                <>No results match your filters for <span className="font-semibold text-red-600 dark:text-red-400">"{searchQuery}"</span></>
              ) : (
                <>Searching for <span className="font-semibold text-blue-600 dark:text-blue-400">"{searchQuery}"</span></>
              )}
            </p>
          )}
        </motion.div>

        {/* Enhanced Search Stats */}
        {searchQuery && filteredAndSortedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-wrap gap-6 justify-center text-center">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{filteredAndSortedMovies.length}</span> movies found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Avg Rating: <span className="font-bold text-green-600 dark:text-green-400">
                    {(filteredAndSortedMovies.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / filteredAndSortedMovies.length).toFixed(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-5 w-5 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Sorted by <span className="font-bold text-purple-600 dark:text-purple-400">
                    {sortBy === "popularity.desc" ? "Popularity" :
                     sortBy === "vote_average.desc" ? "Rating" :
                     sortBy === "release_date.desc" ? "Release Date" : "Title"}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center"
            >
              {Array(10).fill(null).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                We couldn't fetch the search results. Please try again later.
              </p>
            </motion.div>
          )}

          {!loading && !error && !searchQuery && (
            <motion.div
              key="no-query"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Search className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Amazing Movies
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                Use the instant search above to find your favorite movies. Try searching for titles, actors, or genres.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Avengers", "Batman", "Star Wars", "Inception", "Marvel"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && !error && searchQuery && filteredAndSortedMovies.length === 0 && movies.length > 0 && (
            <motion.div
              key="no-filtered-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Filter className="h-16 w-16 text-orange-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Movies Match Your Filters
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-4">
                We found {movies.length} movies for "{searchQuery}", but none match your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
              >
                Clear Filters to See All Results
              </button>
            </motion.div>
          )}

          {!loading && !error && searchQuery && movies.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Search className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Movies Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-4">
                We couldn't find any movies matching "{searchQuery}". Try different keywords or check your spelling.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Try searching for:</span>
                {["Popular movies", "Action", "Comedy", "Drama", "2023 movies"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && !error && filteredAndSortedMovies.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center"
            >
              {filteredAndSortedMovies.map((movie: any, index: number) => (
                <motion.div
                  key={`${movie.id}-${sortBy}-${filterRating}-${filterYear}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="w-full max-w-sm"
                >
                  <Card movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
