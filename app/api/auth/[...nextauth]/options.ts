import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User, Session, Profile, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { FormInputs } from "@/app/(auth)/login/page";

const users: User[] = [
  {
    id: "1",
    username: "test",
    password: "12345",
    email: "alexeyguljajev@gmail.com",
    role: "user",
    avatar: "",
  },
];

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string
      }),
      CredentialsProvider({
        credentials: {
          email: {label: "username", type: "email", required: true},
          password: {label: "password", type: "password", required: true},
        },
        
        async authorize(credentials): Promise<User | null> {
            if (!credentials?.email || !credentials?.password) return null;
            const { email, password } = credentials as FormInputs;
            const currentUser = users.find(user => user.email === credentials.email);
            if (currentUser && currentUser.email === email) {
              return { id: currentUser.id, username: currentUser.username, email: currentUser.email, password: currentUser.password, role: currentUser.role, avatar: currentUser.avatar };
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
        console.log("sign in just triggered")
        if (!profile.email) {
          throw new Error("No profile...");
        }
        console.log("sign in is supposed to work")
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