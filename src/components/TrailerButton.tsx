"use client";

import { useState, useEffect } from "react";
import { Play, Loader2 } from "lucide-react";
import { TrailerModal } from "./TrailerModal";

interface TrailerButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "card" | "page";
  className?: string;
}

interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
  official: boolean;
}

export const TrailerButton = ({ movieId, movieTitle, variant = "card", className = "" }: TrailerButtonProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchTrailer = async () => {
    if (trailerKey || loading) return; // Don't fetch if already have trailer or currently loading
    
    setLoading(true);
    setError(false);
    
    try {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "b80d59c33d6d57ed9c7e3713f91c188a";
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trailer');
      }
      
      const data = await response.json();
      
      // Find the best trailer (prefer official YouTube trailers)
      const trailer = data.results.find((video: Video) => 
        video.site === "YouTube" && 
        video.type === "Trailer" && 
        video.official
      ) || data.results.find((video: Video) => 
        video.site === "YouTube" && 
        video.type === "Trailer"
      ) || data.results.find((video: Video) => 
        video.site === "YouTube"
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (trailerKey) {
      setIsModalOpen(true);
    } else if (!loading && !error) {
      fetchTrailer();
    }
  };

  // Auto-fetch trailer when component mounts for page variant
  useEffect(() => {
    if (variant === "page") {
      fetchTrailer();
    }
  }, [movieId, variant]);

  const buttonClasses = variant === "card" 
    ? `inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl ${className}`
    : `inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl ${className}`;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : error ? (
          <>
            <Play className="w-4 h-4 fill-current opacity-50" />
            No Trailer
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Watch Trailer
          </>
        )}
      </button>

      {trailerKey && (
        <TrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trailerKey={trailerKey}
          movieTitle={movieTitle}
        />
      )}
    </>
  );
};
