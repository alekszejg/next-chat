import { NextResponse } from "next/server";
import type { User, Account, Profile, Session, NextAuthConfig} from "next-auth";
import type { JWT } from "next-auth/jwt";
import refreshAccessToken from "@/app/_actions/refreshAccessToken";


export const BASE_PATH = "/api/auth"; 


export const authConfig = {
    providers: [], // Add later, here to satisfy NextAuthConfig 
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
            console.log("sessions is ", auth)
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

        async signIn({ user, account, profile }: {user: User, account: Account | null, profile?: Profile}) {
            if (account?.provider === "google") {
                
                console.log("google user: ", user);
                console.log("ggoogle account: ", account)
                console.log("google profile: ", profile)
                
                if (!user.name || !user.email) return false;
                user.provider = "google";
                
                
                try {
                    const url = process.env.DOMAIN + `/api/user?email=${user.email}`
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
                        const values = [user.name, user.email, "google", user.image || null]

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

        async jwt({ token, user, account }: {token: JWT, user: User, account: Account | null}) {
            if (account && user) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.accessTokenExpires = Date.now() + (account.expires_in ? account.expires_in * 1000 : 3600 * 1000)
                return token;
            }
                
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                return token
            }
        
            const newToken = await refreshAccessToken(token);
            return {...newToken}
        },

        async session({ session, token, user }: {session: Session, token: JWT, user: User}) {
            if (token) {
                session.access_token = token.access_token;
                session.error = token.error;
            }
            console.log("SESSION IS ", session)
            console.log("TOKEN IS ", token)
            return session;
        },
    }
} satisfies NextAuthConfig;


