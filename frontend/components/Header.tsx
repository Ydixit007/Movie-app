import { LogOut, Plus } from 'lucide-react';

interface HeaderProps {
    onAddMovie?: () => void;
    onLogout?: () => void;
}

export function Header({ onAddMovie, onLogout }: HeaderProps) {
    return (
        <header className="bg-background border-b border-card">
            <div className="max-w-[1440px] mx-auto px-16 md:px-120 py-16 md:py-24 flex justify-between items-center">
                <div className="flex items-center gap-12 md:gap-16">
                    <h2 className="text-heading-4 md:text-heading-2">My movies</h2>
                    {onAddMovie && (
                        <button
                            onClick={onAddMovie}
                            className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-transparent border-2 border-white flex items-center justify-center hover:bg-white hover:text-dark transition-colors group"
                            aria-label="Add movie"
                        >
                            <Plus className="w-14 h-14 md:w-16 md:h-16" />
                        </button>
                    )}
                </div>

                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-8 text-body-small md:text-body font-semibold hover:text-primary transition-colors"
                    >
                        <span className="hidden md:inline">Logout</span>
                        <LogOut className="w-16 h-16" />
                    </button>
                )}
            </div>
        </header>
    );
}