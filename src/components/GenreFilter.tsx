"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";
import { GENRE_MAP, getGenreColor } from "@/utils/genres";

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (genres: number[]) => void;
  className?: string;
}

export const GenreFilter = ({ selectedGenres, onGenreChange, className = "" }: GenreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      onGenreChange(selectedGenres.filter(id => id !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const clearAllGenres = () => {
    onGenreChange([]);
  };

  const genreEntries = Object.entries(GENRE_MAP);

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <Filter className="w-4 h-4 text-gray-900 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
          Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Selected Genres Display */}
      {selectedGenres.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedGenres.map(genreId => (
            <span
              key={genreId}
              className={`${getGenreColor(GENRE_MAP[genreId])} px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1`}
            >
              {GENRE_MAP[genreId]}
              <button
                onClick={() => toggleGenre(genreId)}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllGenres}
            className="px-2 py-1 text-xs bg-red-100 text-red-950 dark:bg-red-800 dark:text-red-100 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filter by Genre</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {genreEntries.map(([genreId, genreName]) => {
                  const id = parseInt(genreId);
                  const isSelected = selectedGenres.includes(id);
                  
                  return (
                    <label
                      key={genreId}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGenre(id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{genreName}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
