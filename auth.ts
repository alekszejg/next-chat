import NextAuth from "next-auth";
import type { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { comparePasswordHash } from "@/app/_actions/bcryptHash";
import { authConfig } from "@/app/api/auth/[...nextauth]/auth.config";


export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google,
        Credentials({
            name: "Credentials",
            credentials: {
              email: {type: "text", required: true},
              password: {type: "password", required: true},
            },
            
            async authorize(credentials): Promise<User | null> {  
              console.log("AUTHORIZE is TRIGGERED")
              
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
              
              if (!data.userExists || !passwordHashMatch) {
                console.log("COULDNT AUTHORIZE THE USER")
                return null;
              } 
            
              else {
                const userData = {
                  id: data.user.id, 
                  name: data.user.name || null,
                  email: data.user.email,
                  username: data.user.username || null,
                  provider: data.user.provider, 
                  is_suspended: data.user.is_suspended || false, 
                  avatar: data.user.avatar || null
                }
                console.log("USER IS AUTHORIZED")
                return userData;
              }
            }
        })
    ],
});

