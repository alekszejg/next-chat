import { User, Account, Profile, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  
  interface User {
    id: string, 
    name: string,
    email: string,
    image: string,
    provider: "credentials" | "google",
    created_at: string,
  }

  interface Session {
    id: string,
    access_token?: string,
    error?: string
  }
}


declare module "next-auth/jwt" {
  interface JWT extends User {
    token: string,
    access_token?: string,
    refresh_token?: string,
    accessTokenExpires?: number,
    error?: string
  }
}