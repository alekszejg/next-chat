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
    password: string, 
    role: string, 
    avatar: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}