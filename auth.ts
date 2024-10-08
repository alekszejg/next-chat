import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { comparePasswordHash } from "@/app/_actions/bcryptHash";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const BASE_PATH = "/api/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    basePath: BASE_PATH,
    pages: {signIn: '/login'},
    session: {
        strategy: 'jwt' as const,
        maxAge: 60 * 60 * 24 * 30, // expires in 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn(params) {
            if (params.account?.provider === "credentials") {
                console.log("signin triggered for signing in with local provider")
                return true
            } else if (params.account?.provider === "google") {
                console.log("signin triggered for google provider")
                return true
            } else return false;
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
})

