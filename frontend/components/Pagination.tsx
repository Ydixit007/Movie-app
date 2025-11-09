interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Show limited page numbers on mobile
    const getVisiblePages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [1, 2];
        }

        if (currentPage === totalPages) {
            return [totalPages - 1, totalPages];
        }

        return [currentPage, currentPage + 1];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={`flex items-center justify-center gap-12 md:gap-16 mt-48 md:mt-64 mb-24 md:mb-32 ${className}`}>
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="text-body-small md:text-body font-semibold px-12 cursor-pointer md:px-16 py-8 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary"
                style={{ color: currentPage === 1 ? 'rgba(255,255,255,0.4)' : 'white' }}
            >
                Prev
            </button>

            <div className="flex items-center gap-8 md:gap-12">
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[36px] md:min-w-[40px] h-[36px] md:h-[40px] rounded cursor-pointer font-semibold text-body-small md:text-body transition-colors ${currentPage === page
                            ? 'bg-primary text-dark'
                            : 'bg-transparent text-white hover:bg-input'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="text-body-small md:text-body font-semibold px-12 md:px-16 py-8 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary cursor-pointer"
                style={{ color: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : 'white' }}
            >
                Next
            </button>
        </div>
    );
}