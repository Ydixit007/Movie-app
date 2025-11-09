'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WaveBackground } from '@/components/WaveBackground';
import axiosInstance from '@/utils/Axios';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { ImageUpload } from '@/components/ImageUpload';

interface Movie {
  _id: string;
  movieName: string;
  publishDate: string;
  cover: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function EditMovieClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    movieName: '',
    publishingYear: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [imageRemoved, setImageRemoved] = useState(false);
  const [errors, setErrors] = useState({
    movieName: '',
    publishingYear: '',
    image: ''
  });

  useEffect(() => {
    if (!movieId) {
      alert('No movie ID provided');
      router.push('/');
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await axiosInstance.get(`/movies/${movieId}`);
        const movie: Movie = response.data as Movie;

        // Extract year from publishDate
        const publishYear = new Date(movie.publishDate).getFullYear().toString();

        setFormData({
          movieName: movie.movieName,
          publishingYear: publishYear
        });

        setImagePreview(movie.cover);
        setOriginalImage(movie.cover);
      } catch (error) {
        console.error('Error fetching movie:', error);
        alert('Failed to fetch movie details. Please try again.');
        router.push('/');
      } finally {
        setIsFetching(false);
      }
    };

    fetchMovie();
  }, [movieId, router]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageRemoved(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setErrors({ ...errors, image: '' });
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageRemoved(true);
    setImagePreview('');
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors = {
      movieName: '',
      publishingYear: '',
      image: ''
    };

    if (!formData.movieName.trim()) {
      newErrors.movieName = 'Title is required';
    }

    if (!formData.publishingYear) {
      newErrors.publishingYear = 'Publishing year is required';
    } else {
      const year = parseInt(formData.publishingYear);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear + 10) {
        newErrors.publishingYear = 'Please enter a valid year';
      }
    }

    if (!imageFile && (!originalImage || imageRemoved)) {
      newErrors.image = 'Please upload an image';
    }

    setErrors(newErrors);
    return !newErrors.movieName && !newErrors.publishingYear && !newErrors.image;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('movieName', formData.movieName);
      formDataToSend.append('publishDate', `${formData.publishingYear}-01-01`);

      if (imageFile) {
        formDataToSend.append('cover', imageFile);
      } else if (imageRemoved && originalImage) {
        formDataToSend.append('removeImage', 'true');
      }

      await axiosInstance.patch(`/movies/update/${movieId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <div className="text-white">Loading movie details...</div>
        <WaveBackground />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <main className="max-w-[1440px] mx-auto px-16 md:px-120 py-32 md:py-80">
        <h1 className="mb-48 md:mb-80 text-heading-3 md:text-heading-2">
          Edit
        </h1>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-24">
          <CustomInput
            placeholder="Title"
            value={formData.movieName}
            onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
            error={errors.movieName}
          />

          <CustomInput
            placeholder="Publishing year"
            type="number"
            value={formData.publishingYear}
            onChange={(e) => setFormData({ ...formData, publishingYear: e.target.value })}
            error={errors.publishingYear}
          />

          <ImageUpload
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            previewUrl={imagePreview}
            error={errors.image}
          />

          <div className="flex gap-16 pt-16">
            <CustomButton
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              fullWidth
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Updating...' : 'Update'}
            </CustomButton>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-80 lg:gap-120">
          <div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              previewUrl={imagePreview}
              error={errors.image}
            />
          </div>

          <div className="flex flex-col">
            <div className="space-y-24">
              <CustomInput
                placeholder="Title"
                value={formData.movieName}
                onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
                error={errors.movieName}
              />

              <CustomInput
                placeholder="Publishing year"
                type="number"
                value={formData.publishingYear}
                onChange={(e) => setFormData({ ...formData, publishingYear: e.target.value })}
                error={errors.publishingYear}
                className="max-w-[216px]"
              />
            </div>

            <div className="flex gap-16 mt-48">
              <CustomButton
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </CustomButton>
            </div>
          </div>
        </div>
      </main>

      <WaveBackground />
    </div>
  );
}
