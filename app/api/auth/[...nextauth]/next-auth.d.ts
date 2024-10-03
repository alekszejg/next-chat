import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  
  interface Session {
    id: string;
    username: string;
  }

  interface User {
    id: string,
    username: string, 
    email: string, 
    role: string, 
    avatar: string
  }

  type SignInParams = {
    user: User | AdapterUser, 
    account: Account | null, 
    profile?: Profile | undefined,
    email?: { verificationRequest?: boolean | undefined; } | undefined
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}