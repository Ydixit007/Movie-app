'use client';

import { EmptyState } from '@/components/EmptyState';
import { MovieCard } from '@/components/MovieCard';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { Loading } from '@/components/Loading';
import { WaveBackground } from '@/components/WaveBackground';
import axiosInstance from '@/utils/Axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

interface Movie {
  _id: string;
  movieName: string;
  publishDate: string;
  cover: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface MovieResponse {
  data: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

const Home = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getMovies = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<MovieResponse>(`/movies/all?page=${page}`);
      setMovies(response.data.data);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMovies([]);
      setIsLoading(false);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      await axiosInstance.delete(`/movies/delete/${id}`);
      toast.success("Movie deleted successfully!");
      getMovies(currentPage);
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie. Please try again.");
    }
  };

  useEffect(() => {
    getMovies(currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    deleteCookie("authToken");
    router.push("/login");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onButtonClick={() => router.push('/add-movie')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header
        onAddMovie={() => router.push('/add-movie')}
        onLogout={handleLogout}
      />

      <main style={{ paddingBottom: "164px" }} className="max-w-[1440px] mx-auto px-16 md:px-120 py-32 md:py-64 relative z-10">

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 md:gap-24">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              title={movie.movieName}
              year={formatYear(movie.publishDate)}
              imageUrl={movie.cover}
              onClick={() => { router.push(`/edit-movie?id=${movie._id}`) }}
              onDelete={() => { deleteMovie(movie._id) }}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      <WaveBackground />
    </div>
  );
};

export default Home;