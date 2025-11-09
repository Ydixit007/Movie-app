import axios from 'axios';

// Create axios instance with proper configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to check if we're on auth pages
const isAuthPage = () => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/signup');
};

axiosInstance.interceptors.request.use(
    (config) => {
        // Only add token if we're not on auth pages
        if (typeof window !== 'undefined' && !isAuthPage()) {
            const token = localStorage.getItem('authToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Only redirect to login if we're not already on auth pages
                    if (typeof window !== 'undefined' && !isAuthPage()) {
                        localStorage.removeItem('authToken');
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 500:
                    console.error('Server error: Please try again later');
                    break;
            }
        } else if (error.request) {
            console.error('Network error: Please check your connection');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;