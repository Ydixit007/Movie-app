import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
    fullWidth?: boolean;
}

export function CustomButton({
    variant = 'primary',
    children,
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {

    const getButtonClasses = () => {
        const baseClasses = `px-32 py-12 rounded-lg font-semibold text-body transition-all cursor-pointer ${fullWidth ? 'w-full' : ''}`;

        switch (variant) {
            case 'primary':
                return `${baseClasses} bg-primary text-dark hover:opacity-90 ${className}`;
            case 'secondary':
                return `${baseClasses} bg-card text-white hover:bg-input ${className}`;
            case 'outline':
                return `${baseClasses} bg-transparent text-white border-2 border-primary hover:bg-primary hover:text-dark ${className}`;
            default:
                return baseClasses;
        }
    };

    return (
        <button className={getButtonClasses()} {...props}>
            {children}
        </button>
    );
}