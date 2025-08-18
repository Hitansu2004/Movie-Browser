"use client";

import { useState, useEffect } from "react";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const useFetch = (apiPath: string, queryTerm: string = "", page: number = 1) => {
  const [data, setData] = useState<TMDBResponse | Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "b80d59c33d6d57ed9c7e3713f91c188a";
  
  // Build URL with proper query parameters
  const buildUrl = () => {
    if (typeof window === 'undefined') return '';
    
    let baseUrl;
    
    // Use discover endpoint for upcoming movies to get better date filtering
    if (apiPath === 'movie/upcoming') {
      const today = new Date().toISOString().split('T')[0];
      baseUrl = `https://api.themoviedb.org/3/discover/movie`;
      const params = new URLSearchParams({
        api_key: API_KEY,
        'primary_release_date.gte': today,
        'sort_by': 'release_date.asc'
      });
      
      if (page > 1) {
        params.append('page', page.toString());
      }
      
      return `${baseUrl}?${params.toString()}`;
    } else {
      baseUrl = `https://api.themoviedb.org/3/${apiPath}`;
    }
    
    const params = new URLSearchParams({
      api_key: API_KEY,
    });

    if (queryTerm) {
      params.append('query', queryTerm);
    }
    
    if (page > 1) {
      params.append('page', page.toString());
    }

    return `${baseUrl}?${params.toString()}`;
  };

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        
        const url = buildUrl();
        if (!url) {
          setError("Unable to build API URL");
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const json = await response.json();
        
        // Check if response has pagination structure
        if (json && typeof json === 'object' && json.results && Array.isArray(json.results)) {
          setData(json as TMDBResponse);
        } else if (Array.isArray(json)) {
          // Fallback for endpoints that return direct arrays
          setData(json);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching data");
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovies();
  }, [apiPath, queryTerm, page]);

  return { data, loading, error };
};
