import EditMovieClient from '@/components/EditMovieClient';
import { Suspense } from 'react';

export default function EditMoviePage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <EditMovieClient />
        </Suspense>
    );
}
