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
            console.log("AUTHORIZED TRIGGERED HERE IS SESSION ", auth)
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
            console.log("SIGNIN FUNCTION HAS TRIGGERED")
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
                        const query = 'INSERT INTO users (name, email, provider, image) VALUES ($1, $2, $3, $4) RETURNING id';
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
                        if (insertData.submitted) {
                            user.id = insertData.userID; // change google ID to ID in my db
                            return true;
                        }
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
            // initial signup
            if (account && user) {
                token.provider = user.provider;

                if (account.provider === "google") {
                    token.access_token = account.access_token;
                    token.refresh_token = account.refresh_token;
                    token.accessTokenExpires = account.expires_in ? Date.now() + account.expires_in * 1000 : Date.now() + 3600 * 1000;
                }
                console.log("FIRST JWT SIGNUP, Token is: ", token)
                return token;
            }

            if (token.accessTokenExpires) {
                console.log("JWT SAYS TOKEN HAS ACCESSTOKENEXPIRES???")
                if (Date.now() < token.accessTokenExpires) {
                    return token;
                }

                const newToken = await refreshAccessToken(token);
                return {...newToken} 
            }

            return token;
        },


        async session({ session, token, user }: {session: Session, token: JWT, user: User}) {
            if (token) {
                session.id = token.sub;
                session.access_token = token.access_token || null;
                session.error = token.error || null;
            }
            console.log("SESSION IS ", session)
            console.log("TOKEN IS ", token)
            return session;
        },
    }
} satisfies NextAuthConfig;

/*
async jwt({ token, user, account }: {token: JWT, user: User, account: Account | null}) {
            console.log("JWT TRIGGERED. Token is: ", token)
            console.log("JWT TRIGGERED. User is: ", user)
            if (!user || !account || account.provider === "credentials") {
                return token;
            }
            
            else if (account.provider === "google" && user) {
                
                if (!token.accessTokenExpires) {
                    return {
                        ...token,
                        access_token: account.access_token,
                        refresh_token: account.refresh_token,
                        accessTokenExpires: account.expires_in ? Date.now() + account.expires_in * 1000 : Date.now() + 3600 * 1000
                    }
                }

                if (Date.now() < token.accessTokenExpires) {
                    return token;
                }

            
                const newToken = await refreshAccessToken(token);
                return {...newToken} 
            }

            return token;
        },

*/
