import Image from 'next/image';

interface MovieCardProps {
    title: string;
    year: string | number;
    imageUrl: string;
    onClick?: () => void;
}

export function MovieCard({ title, year, imageUrl, onClick }: MovieCardProps) {
    return (
        <div
            className="bg-card rounded-[12px] overflow-hidden transition-transform hover:scale-105 p-[8px]"
        >
            <div className="relative aspect-[3/4] bg-input overflow-hidden rounded-[12px]">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized
                />
            </div>
            <div className="p-12 md:p-16">
                <h4 className="text-body-small md:text-heading-6 font-bold mb-4 md:mb-8 truncate">
                    {title}
                </h4>
                <p className="text-body-xs md:text-body-small" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {year}
                </p>
            </div>
        </div>
    );
}