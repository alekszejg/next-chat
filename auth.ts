import NextAuth from "next-auth";
import type { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/app/api/auth/[...nextauth]/auth.config";
import { comparePasswordHash } from "@/app/_actions/bcryptHash";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        }),
        Credentials({
            name: "Credentials",
            credentials: {
              email: {type: "text", required: true},
              password: {type: "password", required: true},
            },
            
            async authorize(credentials): Promise<User | null> {  
              if (!credentials?.email || !credentials?.password) return null;
              
              const url = process.env.DOMAIN + `/api/user?email=${credentials.email}`
              const response = await fetch(url, {
                method: "GET", 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`
              }});
              
              const data = await response.json();
              
              const passwordHashMatch = await comparePasswordHash(credentials.password as string, data.user.password);
              
              if (!data.userExists || !passwordHashMatch) return null;
           
              const userData: User = {
                id: data.user.id, 
                name: data.user.name,
                email: data.user.email,
                image: data.user.image,
                provider: "credentials",
                created_at: data.user.created_at,
              }
              
              return userData;
            }
        })
    ],
});

