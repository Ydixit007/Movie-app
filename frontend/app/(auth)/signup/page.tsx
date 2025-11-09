'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WaveBackground } from '../../../components/WaveBackground';
import { CustomInput } from '../../../components/CustomInput';
import { CustomButton } from '../../../components/CustomButton';
import Link from 'next/link';
import axiosInstance from '@/utils/Axios';
import toast from 'react-hot-toast';
import { setCookie } from 'cookies-next';

interface SignUpResponse {
    access_token: string;
}

interface ErrorResponse {
    message: string;
}

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axiosInstance.post<SignUpResponse>(`/auth/signup`, {
                username: email,
                password
            });

            // Store the access token
            if (res.data.access_token) {
                setCookie('authToken', res.data.access_token);
                localStorage.setItem('authToken', res.data.access_token);
                toast.success('Account created successfully!');
                router.push('/');
            }
        } catch (error: any) {
            console.error('Sign up error:', error);

            if (error) {
                const errorMessage = error.response?.data?.message ||
                    'An error occurred during sign up';
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
            <WaveBackground />

            <div className="w-full max-w-md relative z-10">
                <h1 className="text-center mb-48 md:mb-64">Sign Up</h1>

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
                        minLength={6}
                    />

                    <CustomButton
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </CustomButton>

                    <div className="text-center">
                        Already have an account?{' '}
                        <Link className='text-primary' href={"/login"}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}