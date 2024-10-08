import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  
  interface Session {
    id: string,
    email: string
  }

  interface User {
    id: string,
    name: string | null
    email: string, 
    provider: "local" | "google", 
    is_suspended: boolean, 
    avatar: string | null
    username: string | null,
  }

  type SignInParams = {
    user: User | AdapterUser, 
    account: Account | null, 
    profile?: Profile | undefined,
  }

}

declare module "next-auth/jwt" {
  interface JWT extends User {
    token: string;
  }
}