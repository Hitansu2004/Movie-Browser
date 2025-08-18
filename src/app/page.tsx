// Enhanced home page with recommendations and movie lists
import { MovieList } from "@/components/MovieList";
import ForYouRecommendations from "@/components/ForYouRecommendations";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section with Recommendations */}
        <section>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Welcome to Cinemate
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your next favorite movie with personalized recommendations and explore trending films
            </p>
          </div>
          
          <Suspense fallback={
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <ForYouRecommendations />
          </Suspense>
        </section>

        {/* Now Playing Section */}
        <section>
          <MovieList apiPath="movie/now_playing" title="Now Playing" />
        </section>
      </main>
    </div>
  );
}
