"use client";

import { getGenreNames, getGenreColor } from "@/utils/genres";

interface GenreBadgesProps {
  genreIds: number[];
  maxGenres?: number;
  size?: "sm" | "md" | "lg";
}

export const GenreBadges = ({ genreIds, maxGenres = 3, size = "sm" }: GenreBadgesProps) => {
  const genreNames = getGenreNames(genreIds).slice(0, maxGenres);
  
  if (genreNames.length === 0) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  return (
    <div className="flex flex-wrap gap-1">
      {genreNames.map((genre) => (
        <span
          key={genre}
          className={`${getGenreColor(genre)} ${sizeClasses[size]} rounded-full font-medium transition-all duration-200 hover:scale-105`}
        >
          {genre}
        </span>
      ))}
      {genreIds.length > maxGenres && (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-950 dark:bg-gray-700 dark:text-gray-100 rounded-full font-medium">
          +{genreIds.length - maxGenres}
        </span>
      )}
    </div>
  );
};
