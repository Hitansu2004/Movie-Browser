import { MovieList } from "@/components/MovieList";

export default function TopRatedMoviesPage() {
  return <MovieList apiPath="movie/top_rated" title="Top Rated Movies" />;
}
