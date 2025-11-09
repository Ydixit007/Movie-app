// components/ImageUpload.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Download, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
    previewUrl?: string;
    error?: string;
}

export function ImageUpload({ onImageSelect, onImageRemove, previewUrl, error }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        onImageSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <div
                className={`relative w-full aspect-[16/9] md:aspect-[4/3] rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${isDragging
                        ? 'border-primary bg-input'
                        : error
                            ? 'border-error'
                            : 'border-white border-opacity-30 hover:border-opacity-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                />

                {previewUrl ? (
                    <>
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageRemove();
                            }}
                            className="absolute top-8 right-8 w-32 h-32 bg-error rounded-full flex items-center justify-center hover:opacity-90 transition-opacity z-10"
                        >
                            <X className="w-20 h-20" />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-24">
                        <Download className="w-32 h-32 md:w-40 md:h-40 mb-16 text-white opacity-60" />
                        <p className="text-body-small md:text-body" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {isDragging ? 'Drop an image here' : 'Drop an image here'}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-body-small text-error mt-8">{error}</p>
            )}
        </div>
    );
}