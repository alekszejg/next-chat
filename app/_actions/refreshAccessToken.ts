"use server"
import type { JWT } from "next-auth/jwt"


export default async function refreshAccessToken(token: JWT) {
    const url = "https://oauth2.googleapis.com/token?" + new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID as string,
        client_secret: process.env.AUTH_GOOGLE_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
    });
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        
        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            access_token: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fallback to old refresh token
        }

    } catch (error) {
        console.log(error);
        return {...token, error: "RefreshAccessTokenError"};
    }
}