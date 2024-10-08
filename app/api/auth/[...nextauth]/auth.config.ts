import { NextResponse } from "next/server";
import type { User, Session, NextAuthConfig, SignInParams } from "next-auth";
import type { JWT } from "next-auth/jwt";
import addNewUser from "@/app/_actions/addNewUser";

export const BASE_PATH = "/api/auth"; 


export const authConfig = {
    providers: [], // Add inside NextAuth(), here it's created to satisfy NextAuthConfig 
    basePath: BASE_PATH,
    session: {
        strategy: 'jwt' as const,
        maxAge: 60 * 60 * 24 * 30, // expires in 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        
        async authorized({ auth, request}) {
            console.log("special middleware triggered")
            const PROTECTED_PATHS = ["/chats", "/calls", "/friends", "/settings"];
            const isLoggedIn = auth?.user;
            if (PROTECTED_PATHS.includes(request.nextUrl.pathname)) {
                if (isLoggedIn) return true;
                else return NextResponse.redirect(new URL(
                    `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
                );
            }
            return true;
        },

        async signIn(params: SignInParams) {
            if (params.account?.provider === "credentials") {
                console.log("SIGNIN TRIGGERED for local provider")
                return true;
            }

            else if (params.account?.provider === "google") {
                if (!params.user.name || !params.user.email) return false;
            
                try {
                    const url = process.env.DOMAIN + `/api/user?email=${params.user.email}`
                    const response = await fetch(url, {
                        method: "GET", 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.API_KEY}`
                        }});
                    
                        const data = await response.json();
                    
                    if (response.ok && !data.userExists) {
                        const url =  process.env.DOMAIN + "/api/user";
                        const query = 'INSERT INTO users (name, email, provider, image) VALUES ($1, $2, $3, $4)';
                        const values = [params.user.name, params.user.email, "google", params.profile.picture || null]

                        const insertResponse = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.API_KEY}`
                            },
                            body: JSON.stringify({ query, values })
                        })

                        const insertData = await insertResponse.json();
                        if (insertData.submitted) return true;
                        else {
                            console.error("Internal error during data insertion from signIn with google provider")
                            return false;
                        }
                    }
                    else if (!response.ok) {
                        console.error("Internal error during data insertion from signIn with google provider")
                        return false;
                    }
                } catch {
                    console.error("Either failed to check of user is with external provider is new or failed to add them in signIn() callback");
                    return false;
                }
            } 
    
            return true;
        },

        async jwt({ token, user }: {token: JWT, user: User}) {
            return {...user, ...token};
        },

        async session({ session, token}: {session: Session, token: JWT}) {
            if (session) {
                session.id = token.id as string;;
                session.email = token.email as string;; 
            }
            return session;
        },
    }
} satisfies NextAuthConfig;

/*
try {
if (response.ok && !data.userExists) {
                        const query = 'INSERT INTO users (name, email, provider, image) VALUES ($1, $2, $3, $4)';
                        const values = [params.user.name, params.user.email, "google", params.user.image || null]
                        const response = await addNewUser(query, values as string[])

                        if (response.submitted) return true;
                        else return false;
                    } else if (data.userExists) return true;
*/