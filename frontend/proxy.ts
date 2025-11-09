import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const { pathname } = request.nextUrl;

    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};