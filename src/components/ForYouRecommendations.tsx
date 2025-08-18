'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Star, Heart } from 'lucide-react';
import { Card } from './Card';
import { Movie } from '@/hooks/useFetch';

interface ForYouRecommendationsProps {
  className?: string;
}

const API_KEY = 'b80d59c33d6d57ed9c7e3713f91c188a';
const BASE_URL = 'https://api.themoviedb.org/3';

const ForYouRecommendations: React.FC<ForYouRecommendationsProps> = ({ className = '' }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<'trending' | 'top_rated' | 'popular'>('trending');

  // Fetch personalized recommendations (using trending as fallback)
  const fetchRecommendations = async (type: 'trending' | 'top_rated' | 'popular') => {
    setLoading(true);
    try {
      let url = '';
      
      switch (type) {
        case 'trending':
          url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=1`;
          break;
        case 'top_rated':
          url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`;
          break;
        case 'popular':
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
          break;
      }

      const response = await fetch(url);
      const data = await response.json();
      setRecommendations(data.results?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(currentSection);
  }, [currentSection]);

  const sections = [
    {
      key: 'trending' as const,
      title: 'Trending Now',
      description: 'What everyone is watching',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'top_rated' as const,
      title: 'Highly Rated',
      description: 'Critics\' favorites',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      key: 'popular' as const,
      title: 'Most Popular',
      description: 'Audience favorites',
      icon: Heart,
      color: 'from-pink-500 to-purple-500'
    }
  ];

  const currentSectionData = sections.find(s => s.key === currentSection)!;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentSectionData.color} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <p className="text-white/80 text-sm">Discover amazing movies picked just for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.key;
            
            return (
              <button
                key={section.key}
                onClick={() => setCurrentSection(section.key)}
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
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <currentSectionData.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentSectionData.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentSectionData.description}
          </p>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"
              />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card movie={movie} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <currentSectionData.icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recommendations found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't find any recommendations at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYouRecommendations;
