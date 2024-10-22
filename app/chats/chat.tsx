"use client"
import { useEffect } from "react";
import { socket } from "@/app/socket";
import type { Session } from "next-auth";


export default function Chat({ session, chatID }: {session: Session | null, chatID: string | null}) {
    const styling = {
      wrapper: chatID ? "block" : "hidden"
    }

    const getChatInfo = async () => {
      const url = `http://localhost:3000/api/chats?userID=${session?.id}&chatID=${chatID}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }


    useEffect(() => {
        if (!chatID) return;
        
        socket.connect();
    
        socket.on("connect", () => {
          console.log(`Connected with id: ${socket.id}`);
        });
    
        socket.on("message", (message) => {
          console.log("Received message:", message);
        });
    
        return () => {socket.disconnect()};
        
    }, []);

    return (
        <div className={styling.wrapper}>This is the chat section</div>
    )
}