"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Users, ExternalLink } from "lucide-react";
import { Movie } from "@/hooks/useFetch";
import { GenreBadges } from "@/components/GenreBadges";
import { TrailerButton } from "@/components/TrailerButton";

interface CardProps {
  movie: Movie;
  index?: number;
}

export const Card = ({ movie, index = 0 }: CardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    overview,
    poster_path,
    vote_average,
    vote_count,
    release_date,
    genre_ids,
  } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/backup.png";

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (rating >= 6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        transition: { 
          duration: 0.3,
          ease: "easeOut",
          type: "spring",
          stiffness: 300
        }
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu cursor-pointer border border-gray-200 dark:border-gray-700 w-full flex flex-col h-full"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        <Link href={`/movie/${id}`} className="block relative h-full group-hover:scale-105 transition-transform duration-300">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={index < 6}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="text-white text-center"
            >
              <ExternalLink className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">View Details</span>
            </motion.div>
          </div>
        </Link>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingBadgeColor(vote_average)}`}>
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            {vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/movie/${id}`} className="flex-shrink-0">
          <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-h-[3.5rem]">
            {title}
          </h3>
        </Link>
        
        {/* Genre Badges */}
        <div className="mb-3">
          <GenreBadges genreIds={genre_ids} maxGenres={2} size="sm" />
        </div>
        
        <p className="mb-4 text-gray-700 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
          {overview || "No description available."}
        </p>

        {/* Movie Details */}
        <div className="space-y-3 mb-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Star className={`w-4 h-4 mr-1 ${getRatingColor(vote_average)}`} fill="currentColor" />
              <span className="font-semibold">{vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-xs">{vote_count.toLocaleString()}</span>
            </div>
          </div>

          {release_date && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(release_date).getFullYear()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 flex-shrink-0">
          {/* Trailer Button */}
          <TrailerButton 
            movieId={id}
            movieTitle={title}
            variant="card"
            className="w-full justify-center"
          />
          
          {/* View Details Button */}
          <Link
            href={`/movie/${id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg animate-pulse overflow-hidden">
    <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);
