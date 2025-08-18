import { MovieList } from "@/components/MovieList";

export default function PopularMoviesPage() {
  return <MovieList apiPath="movie/popular" title="Popular Movies" />;
}
