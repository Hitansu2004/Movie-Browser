// Genre mapping for TMDB genre IDs
export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure", 
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

// Simplified genre colors - black text in light mode, white text in dark mode
export const GENRE_COLORS: Record<string, string> = {
  "Action": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Adventure": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Animation": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Comedy": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Crime": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Documentary": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Drama": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Family": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Fantasy": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "History": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Horror": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Music": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Mystery": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Romance": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Science Fiction": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "TV Movie": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Thriller": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "War": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
  "Western": "bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
};

// Utility functions
export const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
};

export const getGenreColor = (genreName: string): string => {
  return GENRE_COLORS[genreName] || "bg-gray-100 text-gray-950 dark:bg-gray-700 dark:text-gray-100";
};
