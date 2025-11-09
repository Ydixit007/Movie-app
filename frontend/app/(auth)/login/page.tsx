'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/utils/Axios';
import toast from 'react-hot-toast';
import { setCookie } from 'cookies-next';
import { WaveBackground } from '@/components/WaveBackground';
import { CustomInput } from '@/components/CustomInput';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomButton } from '@/components/CustomButton';

interface LoginResponse {
    access_token: string;
}

interface ErrorResponse {
    message: string;
}

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axiosInstance.post<LoginResponse>(`/auth/login`, {
                username: email,
                password
            });

            // Store the access token
            if (res.data.access_token) {
                // Set cookie with appropriate expiration based on remember me
                const cookieOptions = rememberMe
                    ? { maxAge: 30 * 24 * 60 * 60 } // 30 days
                    : { maxAge: 24 * 60 * 60 }; // 1 day

                setCookie('authToken', res.data.access_token, cookieOptions);
                localStorage.setItem('authToken', res.data.access_token);

                toast.success('Logged in successfully!');
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error) {
                const errorMessage = error.response?.data?.message ||
                    'An error occurred during login';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-16 relative overflow-hidden">
            {/* Wave Background */}
            <WaveBackground />

            {/* Sign In Form */}
            <div className="w-full max-w-md relative z-10">
                <h1 className="text-center mb-48 md:mb-64">Sign in</h1>

                <form onSubmit={handleSubmit} className="space-y-24">
                    <CustomInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <CustomInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <div className="flex justify-center">
                        <CustomCheckbox
                            id="remember-me"
                            label="Remember me"
                            checked={rememberMe}
                            onChange={setRememberMe}
                        />
                    </div>

                    <CustomButton
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </CustomButton>

                    <div className="text-center">
                        Don't have an account?{' '}
                        <Link className='text-primary' href="/signup">
                            Sign-up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}