'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
import { Card } from './Card';
import { Movie } from '@/hooks/useFetch';

interface RecommendationEngineProps {
  currentMovieId: number;
  currentMovie?: Movie;
}

interface RecommendationSection {
  title: string;
  description: string;
  icon: React.ElementType;
  movies: Movie[];
  loading: boolean;
}

const API_KEY = 'b80d59c33d6d57ed9c7e3713f91c188a';
const BASE_URL = 'https://api.themoviedb.org/3';

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  currentMovieId,
  currentMovie
}) => {
  const [recommendations, setRecommendations] = useState<{
    similar: Movie[];
    recommended: Movie[];
    trending: Movie[];
    topRated: Movie[];
  }>({
    similar: [],
    recommended: [],
    trending: [],
    topRated: []
  });

  const [loading, setLoading] = useState({
    similar: true,
    recommended: true,
    trending: true,
    topRated: true
  });

  const [activeTab, setActiveTab] = useState<'similar' | 'recommended' | 'trending' | 'topRated'>('similar');

  // Fetch similar movies
  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${currentMovieId}/similar?api_key=${API_KEY}&page=1`
      );
      const data = await response.json();
      setRecommendations(prev => ({ ...prev, similar: data.results?.slice(0, 12) || [] }));
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      setRecommendations(prev => ({ ...prev, similar: [] }));
    } finally {
      setLoading(prev => ({ ...prev, similar: false }));
    }
  };

  // Fetch recommended movies (TMDB recommendations)
  const fetchRecommendedMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${currentMovieId}/recommendations?api_key=${API_KEY}&page=1`
      );
      const data = await response.json();
      setRecommendations(prev => ({ ...prev, recommended: data.results?.slice(0, 12) || [] }));
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
      setRecommendations(prev => ({ ...prev, recommended: [] }));
    } finally {
      setLoading(prev => ({ ...prev, recommended: false }));
    }
  };

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=1`
      );
      const data = await response.json();
      setRecommendations(prev => ({ ...prev, trending: data.results?.slice(0, 12) || [] }));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setRecommendations(prev => ({ ...prev, trending: [] }));
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  // Fetch top rated movies with similar genres
  const fetchTopRatedByGenre = async () => {
    try {
      if (!currentMovie?.genre_ids.length) {
        // Fallback to general top rated
        const response = await fetch(
          `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`
        );
        const data = await response.json();
        setRecommendations(prev => ({ ...prev, topRated: data.results?.slice(0, 12) || [] }));
        return;
      }

      // Get top rated movies with similar genres
      const genreQuery = currentMovie.genre_ids.join(',');
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreQuery}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
      );
      const data = await response.json();
      
      // Filter out the current movie and get top 12
      const filteredResults = data.results?.filter((movie: Movie) => movie.id !== currentMovieId).slice(0, 12) || [];
      setRecommendations(prev => ({ ...prev, topRated: filteredResults }));
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      setRecommendations(prev => ({ ...prev, topRated: [] }));
    } finally {
      setLoading(prev => ({ ...prev, topRated: false }));
    }
  };

  useEffect(() => {
    if (currentMovieId) {
      // Reset loading states
      setLoading({
        similar: true,
        recommended: true,
        trending: true,
        topRated: true
      });

      // Fetch all recommendations
      fetchSimilarMovies();
      fetchRecommendedMovies();
      fetchTrendingMovies();
      fetchTopRatedByGenre();
    }
  }, [currentMovieId]);

  const recommendationSections: Record<string, RecommendationSection> = {
    similar: {
      title: 'Similar Movies',
      description: 'Movies with similar themes, genres, and style',
      icon: Heart,
      movies: recommendations.similar,
      loading: loading.similar
    },
    recommended: {
      title: 'Recommended for You',
      description: 'Personalized picks based on this movie',
      icon: Sparkles,
      movies: recommendations.recommended,
      loading: loading.recommended
    },
    trending: {
      title: 'Trending This Week',
      description: 'What everyone is watching right now',
      icon: TrendingUp,
      movies: recommendations.trending,
      loading: loading.trending
    },
    topRated: {
      title: 'Highly Rated',
      description: 'Top-rated movies in similar genres',
      icon: Star,
      movies: recommendations.topRated,
      loading: loading.topRated
    }
  };

  const currentSection = recommendationSections[activeTab];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Movie Recommendations</h2>
            <p className="text-purple-100 text-sm">Discover your next favorite movie</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-0">
          {Object.entries(recommendationSections).map(([key, section]) => {
            const Icon = section.icon;
            const isActive = activeTab === key;
            
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <currentSection.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentSection.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentSection.description}
              </p>
            </div>

            {/* Movies Grid */}
            {currentSection.loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"
                  />
                ))}
              </div>
            ) : currentSection.movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentSection.movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      movie={movie}
                      index={index}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <currentSection.icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No recommendations found
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  We couldn't find any {currentSection.title.toLowerCase()} at the moment.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecommendationEngine;
