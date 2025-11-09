import { WaveBackground } from './WaveBackground';
import { CustomButton } from './CustomButton';

interface EmptyStateProps {
    title: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function EmptyState({ title, buttonText, onButtonClick }: EmptyStateProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-24 relative overflow-hidden">
            {/* Wave Background */}
            <WaveBackground />

            {/* Content */}
            <div className="relative z-10 text-center">
                <h1 className="mb-32 md:mb-48 md:text-heading-1 text-heading-3 px-16">
                    {title}
                </h1>
                <CustomButton variant="primary" onClick={onButtonClick}>
                    {buttonText}
                </CustomButton>
            </div>
        </div>
    );
}