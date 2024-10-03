import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User, Session, Profile, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { $fetch } from "../../user/api.fetchUser";


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
          username: {type: "text"}
        },
        
        async authorize(credentials): Promise<User | null> {  
          if (!credentials?.email || !credentials?.password) return null;
            const { email, password } = credentials;
            
            // check if action was login
            if (credentials.email) {
              console.log("triggered the check");
              const response = await $fetch.get({email: credentials.email, username: undefined});
              console.log("response is...", response);
            }

            /*const { email, password } = credentials as FormInputs;
            const currentUser = users.find(user => user.email === credentials.email);
            if (currentUser && currentUser.email === email) {
              return { id: currentUser.id, username: currentUser.username, email: currentUser.email, password: currentUser.password, role: currentUser.role, avatar: currentUser.avatar };
            }*/
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