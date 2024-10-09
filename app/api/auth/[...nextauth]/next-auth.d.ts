import { User, Account, Profile, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  
  interface User {
    id: string, 
    name: string,
    email: string,
    image: string | null,
    provider: "credentials" | "google",
  }

  interface Session {
    id: string,
    access_token: string | null,
    error: string | null
  }
}


declare module "next-auth/jwt" {
  interface JWT extends User {
    sub: string,
    access_token?: string,
    refresh_token?: string,
    accessTokenExpires?: number,
    error?: string
  }
}