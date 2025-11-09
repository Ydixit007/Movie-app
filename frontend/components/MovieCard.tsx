import { Trash } from 'lucide-react';
import Image from 'next/image';

interface MovieCardProps {
    title: string;
    year: string | number;
    imageUrl: string;
    onClick?: () => void;
    onDelete?: () => void;
}

export function MovieCard({ title, year, imageUrl, onClick, onDelete }: MovieCardProps) {
    return (
        <div
            className="bg-card rounded-xl overflow-hidden transition-transform hover:scale-105 p-8 relative cursor-pointer"
            onClick={onClick}
        >
            {onDelete && (
                <div
                    className="absolute top-16 right-16 z-10 bg-background/30 text-white rounded-full p-[8px] hover:bg-background transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash className="w-[16px] h-[16px] text-white" />
                </div>
            )}

            <div className="relative aspect-[3/4] bg-input overflow-hidden rounded-xl">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized
                />
            </div>

            <div className="p-4 md:p-6">
                <h4 className="text-body-small md:text-heading-6 font-bold mb-1 md:mb-2 truncate">
                    {title}
                </h4>
                <p className="text-body-xs md:text-body-small text-white/60">{year}</p>
            </div>
        </div>
    );
}
