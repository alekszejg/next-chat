"use client"
import Image from "next/image";
import { signIn } from "next-auth/react"
import { FormEvent } from "react";


export default function SignInWithGoogleButton() {
    const styling = {
        image: "w-[2rem] h-[2rem]",
        button: "flex items-center gap-x-3 py-2 pl-3 border-2 border-[hsl(249,3%,60%)] rounded-lg"
    };

    const handleGoogleSignIn = (event: FormEvent) => {
        event.preventDefault();
        signIn('google', {callbackUrl: '/'}); 
    };

    return (
        <button className={styling.button} onClick={handleGoogleSignIn}>
            <Image src="/icons/googleLogo.svg" width={32} height={32} alt="google icon" />
            Sign in with Google
        </button>
    )
}