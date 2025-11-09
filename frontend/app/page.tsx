'use client';

import { EmptyState } from '@/components/EmptyState';
import { MovieCard } from '@/components/MovieCard';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { WaveBackground } from '@/components/WaveBackground';
import axiosInstance from '@/utils/Axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

interface Movie {
  _id: string;
  movieName: string;
  publishDate: string;
  cover: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}


const Home = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMovies = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/movies/all");
      setMovies([]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMovies([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    deleteCookie("authToken");
    router.push("/login");
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && movies.length === 0) {
    return (
      <EmptyState
        title='Your movie list is empty'
        buttonText='Add a new movie'
        onButtonClick={() => { }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header
        onAddMovie={() => { }}
        onLogout={handleLogout}
      />

      <main className="max-w-[1440px] mx-auto px-16 md:px-120 py-32 md:py-64">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 md:gap-24 mb-26">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              title={movie.movieName}
              year={formatYear(movie.publishDate)}
              imageUrl={movie.cover}
              onClick={() => console.log('Movie clicked:', movie)}
            />
          ))}
        </div>
      </main>

      <WaveBackground />
    </div>
  );
};

export default Home;