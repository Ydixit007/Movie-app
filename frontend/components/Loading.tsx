export function Loading() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-background">
            <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-4 border-input rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-body-large mt-24" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Loading...
            </p>
        </div>
    );
}