import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User, Session, Profile, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { $fetch } from "@/app/api/user/api.fetchUser";


export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string
      }),
      CredentialsProvider({
        credentials: {
          email: {type: "text", required: true},
          password: {type: "password", required: true},
          name: {type: "text"},
        },
        
        async authorize(credentials): Promise<User | null> {  
          if (!credentials?.email || !credentials?.password) return null;
         
          console.log("received credentials", credentials)
          
          // Duduce form type. Registration might require post request into DB
          let formType: "register" | "login" | undefined;
          
          if (credentials.name) {formType = "register"}
          else if (!credentials.name) {formType = "login"};  
         
          
          if (formType === "register") {

          }

          else if (formType === "login") {
            const response = await $fetch.get({email: credentials.email, username: undefined});
            const data = await response.json();
            
            if (!response.ok) return data.error;
            
            if (data.exists) {
              const userData = {id: data.id, email: data.email, username: data.username, role: data.role, avatar: data.avatar};
              return userData;
            } 
            else {
              return null;
            }
          }

          return null;
        }
      })
    ],

    session: {
      strategy: 'jwt' as const,
      maxAge: 60 * 60 * 24 * 30 // expires in 30 days
    },

    pages: {signIn: '/login'},

    callbacks: {
      
      async signIn({ account, profile }: {account: Account, profile: Profile}) {
        if (!profile.email) {
          throw new Error("No profile...");
        }
        console.log("account info here:\n\n", account)
        console.log("profile info here:\n\n", profile)
        return true; 
      },

      async session({ session, token }: { session: Session; token: JWT }) {
        if (token) {
          session.id = token.id;
          session.username = token.username;
        }
        return session;
      },

      async jwt({ token, user }: { token: JWT; user: User }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }

        return token;
      }
    }
};