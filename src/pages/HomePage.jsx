import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import GenreFilter from "../components/GenreFilter";
import PopularMovies from "../components/PopularMovies";
import TrendingThisWeek from "../components/TrendingThisWeek";
import PassBanner from "../components/PassBanner";
import { getPopularMovies, getTrendingMovies } from "../api/tmdb";
import { useGenres } from "../context/GenresContext";

function HomePage() {
  const { genres } = useGenres();
  const [selectedGenre, setSelectedGenre] = useState(null); // null = All Genres
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "CineHub";
  }, []);

  // Runs once when the page opens: load trending movies.
  useEffect(() => {
    getTrendingMovies()
      .then(setTrendingMovies)
      .catch((err) => setError(err.message));
  }, []);

  // Runs on first load AND every time the user picks a different genre.
  useEffect(() => {
    let ignore = false; // if the genre changes again, forget the old answer
    getPopularMovies(selectedGenre)
      .then((movies) => {
        if (!ignore) setPopularMovies(movies);
      })
      .catch((err) => setError(err.message));
    return () => {
      ignore = true;
    };
  }, [selectedGenre]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-14">
        <Hero movies={trendingMovies.slice(0, 4)} />
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
        <PopularMovies movies={popularMovies} />
        <TrendingThisWeek movies={trendingMovies} />
        <PassBanner />
      </div>
    </main>
  );
}

export default HomePage;
