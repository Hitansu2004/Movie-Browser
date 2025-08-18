import { MovieList } from "@/components/MovieList";

export default function UpcomingMoviesPage() {
  return <MovieList apiPath="movie/upcoming" title="Upcoming Movies" />;
}
