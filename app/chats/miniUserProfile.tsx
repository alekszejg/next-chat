"use client"
import Image from "next/image";
import type { User, Session } from "next-auth";

export default function MiniUserProfile({ session }: {session: Session | null}) {
    const { name, email, image } = session?.user as User;
    
    const styling = {
        image: "rounded-full relative",
        name: "w-[100px] text-[0.9rem] text-nowrap relative bottom-1"
    }

    return (
        <>
        <Image src={image as string} className={styling.image} width={40} height={40} alt="Your profile picture" />
         <h3 className={styling.name}>{name}</h3>
        </>
    );
}