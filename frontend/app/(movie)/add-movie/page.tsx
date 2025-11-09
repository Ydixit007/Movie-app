// app/create-movie/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WaveBackground } from '@/components/WaveBackground';
import axiosInstance from '@/utils/Axios';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { ImageUpload } from '@/components/ImageUpload';

export default function CreateMoviePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        publishingYear: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [errors, setErrors] = useState({
        title: '',
        publishingYear: '',
        image: ''
    });

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrors({ ...errors, image: '' });
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview('');
    };

    const validateForm = () => {
        const newErrors = {
            title: '',
            publishingYear: '',
            image: ''
        };

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
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

        if (!imageFile) {
            newErrors.image = 'Please upload an image';
        }

        setErrors(newErrors);
        return !newErrors.title && !newErrors.publishingYear && !newErrors.image;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('movieName', formData.title);
            formDataToSend.append('publishDate', `${formData.publishingYear}-01-01`);
            if (imageFile) {
                formDataToSend.append('cover', imageFile);
            }

            // Changed endpoint from '/movies' to '/movies/create'
            await axiosInstance.post('/movies/create', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/');
        } catch (error) {
            console.error('Error creating movie:', error);
            alert('Failed to create movie. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-background relative">
            <main className="max-w-[1440px] mx-auto px-16 md:px-120 py-32 md:py-80">
                <h1 className="mb-48 md:mb-80 text-heading-3 md:text-heading-2">
                    Create a new movie
                </h1>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-24">
                    <CustomInput
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        error={errors.title}
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
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </CustomButton>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-80 lg:gap-120">
                    {/* Left Column - Image Upload */}
                    <div>
                        <ImageUpload
                            onImageSelect={handleImageSelect}
                            onImageRemove={handleImageRemove}
                            previewUrl={imagePreview}
                            error={errors.image}
                        />
                    </div>

                    {/* Right Column - Form */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-24">
                            <CustomInput
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                error={errors.title}
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
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </main>

            <WaveBackground />
        </div>
    );
}