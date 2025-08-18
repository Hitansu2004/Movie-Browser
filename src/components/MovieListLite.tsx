"use client";

import { useFetch, Movie, TMDBResponse } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

interface MovieListLiteProps {
  apiPath: string;
  title: string;
}

// Minimal version of MovieList with zero external animation/icon dependencies
// to help isolate the runtime TypeError (reading 'call').
export const MovieListLite = ({ apiPath, title }: MovieListLiteProps) => {
  const { data: response, loading, error } = useFetch(apiPath, "", 1);

  const isPaged = (d: TMDBResponse | Movie[]): d is TMDBResponse => {
    return typeof d === 'object' && d !== null && 'results' in d && 'total_pages' in d;
  };

  // Process data
  const movies = response ? 
    (isPaged(response) ? response.results : Array.isArray(response) ? response : []) : 
    [];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-48 animate-pulse"></div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h1>
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load movies</p>
          <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h1>
      {movies.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-center">No movies found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.slice(0, 20).map((movie: Movie) => {
            // Defensive check to ensure movie exists and has required properties
            if (!movie || typeof movie !== 'object' || !movie.id) {
              return null;
            }

            return (
              <div 
                key={movie.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200"
              >
                <div className="font-semibold line-clamp-2 mb-2 text-gray-900 dark:text-gray-100">
                  {movie.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Year: {movie.release_date ? movie.release_date.slice(0, 4) : '—'}
                </div>
              </div>
            );
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
};

export default MovieListLite;
