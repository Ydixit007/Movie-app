import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'default' | 'active' | 'error';
}

export function CustomInput({
    label,
    error,
    variant = 'default',
    className = '',
    ...props
}: InputProps) {

    const getInputClasses = () => {
        const baseClasses = 'w-full bg-input text-white px-16 py-12 rounded-lg border-2 outline-none transition-colors text-body';

        if (error || variant === 'error') {
            return `${baseClasses} border-error`;
        }

        if (variant === 'active') {
            return `${baseClasses} border-primary`;
        }

        return `${baseClasses} border-transparent focus:border-primary`;
    };

    return (
        <div className={`mb-16 ${className}`}>
            {label && (
                <label className="text-body-small mb-8 block" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {label}
                </label>
            )}
            <input
                className={getInputClasses()}
                {...props}
            />
            {error && (
                <p className="text-body-small mt-8 text-error">
                    {error}
                </p>
            )}
        </div>
    );
}