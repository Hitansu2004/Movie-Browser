import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  Calendar, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  ArrowLeft,
  Users,
  Award
} from "lucide-react";
import RecommendationEngine from "@/components/RecommendationEngine";
import { Movie } from "@/hooks/useFetch";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  budget: number;
  revenue: number;
  imdb_id: string;
  tagline: string;
  status: string;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

async function getMovieDetails(id: string): Promise<MovieDetail> {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "b80d59c33d6d57ed9c7e3713f91c188a";
  
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Cinemate/1.0'
      }
    }
  );
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Movie not found');
    }
    throw new Error(`Failed to fetch movie: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  
  if (!data || !data.id) {
    throw new Error('Invalid movie data received');
  }
  
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const movie = await getMovieDetails(resolvedParams.id);
    return {
      title: `${movie.title} | Cinemate`,
      description: movie.overview || `Watch ${movie.title} - ${movie.tagline}`,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path 
          ? [`https://image.tmdb.org/t/p/w780${movie.poster_path}`]
          : [],
      },
    };
  } catch {
    return {
      title: 'Movie Not Found | Cinemate',
      description: 'The requested movie could not be found.',
    };
  }
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let movie: MovieDetail;
  
  try {
    const resolvedParams = await params;
    movie = await getMovieDetails(resolvedParams.id);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }

  const posterImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/images/backup.png";

  const backdropImage = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop */}
      {backdropImage && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={backdropImage}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${backdropImage ? '-mt-48' : 'pt-8'} relative z-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={posterImage}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {movie.title}
                  </h1>
                  
                  {movie.tagline && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                      "{movie.tagline}"
                    </p>
                  )}

                  {/* Rating & Stats */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Star className={`w-6 h-6 ${getRatingColor(movie.vote_average)} fill-current`} />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        / 10
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5" />
                      <span>{movie.vote_count.toLocaleString()} votes</span>
                    </div>

                    {movie.runtime > 0 && (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-5 h-5" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Info */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Box Office
                    </h3>
                    <div className="space-y-3">
                      {movie.budget > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(movie.budget)}
                          </span>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(movie.revenue)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {movie.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Release Date:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(movie.release_date).toLocaleDateString()}
                      </span>
                    </div>
                    {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {movie.spoken_languages.slice(0, 2).map(lang => lang.english_name).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="flex flex-wrap gap-4">
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on IMDb
                  </a>
                )}
                
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </div>

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Production Companies
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.production_companies.slice(0, 6).map((company) => (
                      <div key={company.id} className="text-center">
                        {company.logo_path && (
                          <div className="relative h-12 mb-2">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                              alt={company.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-contain"
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {company.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecommendationEngine 
          currentMovieId={movie.id}
          currentMovie={{
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            genre_ids: movie.genres.map(g => g.id),
            popularity: 0, // Not available in detail response
            original_language: movie.spoken_languages[0]?.iso_639_1 || 'en',
            original_title: movie.title,
            adult: false, // Not available in detail response
            video: false // Not available in detail response
          } as Movie}
        />
      </div>
    </div>
  );
}
