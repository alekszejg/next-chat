import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const queryParams = url.searchParams;

    if (pathname === "/api/user") {
        const emailParam = queryParams.get("email");
        const usernameParam = queryParams.get("username");

        if (!emailParam && !usernameParam) {
            return NextResponse.json({ error: 'Invalid Route' }, { status: 404 });
        }
    }

    return NextResponse.next();
}


export const checkAuth = withAuth({
    pages: {
        signIn: '/login', 
    },
});


export const config = {
    matcher: [
        "/register", "/login", "/calls", "/chats", "/friends", "/settings",
        "/api/user"
    ]
};