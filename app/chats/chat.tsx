"use client"
import { useState, useEffect } from "react";
import { socket } from "@/app/socket";
import type { Session } from "next-auth";
import type { Message } from "@/app/chats/chat.types";

type User = {id: string, name: string, email: string, image: string};
type UserInfo = {name: string, email: string, image: string}

export default function Chat({ session, chatID }: {session: Session | null, chatID: string | null}) {
    const styling = {
      wrapper: chatID ? "block" : "hidden",
      noMessages: "text-sm, text-center, opacity-60",
      error: "text-sm, text-center, opacity-60"
    }

    const [error, setError] = useState<null | string>(null);
    let userInfo: {[key: string]: UserInfo} = {};
    let messages: Message[] | [] = [];
    

    const getChatInfo = async () => {
      const url = `http://localhost:3000/api/chats?userID=${session?.id}&chatID=${chatID}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json();
        data.users.map((user: User) => {
          userInfo[user.id] = {name: user.name, email: user.email, image: user.image};
        });
        messages = data.messages;
      } else {
          setError("Couldn't load chat information. Try again later");
      }
    }


    useEffect(() => {
        if (!chatID) return;
        getChatInfo();

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
        <div className={styling.wrapper}>
          
          {error && <p className={styling.error}>{error}</p>}
          
          {!error && messages.length === 0 && 
            <p className={styling.noMessages}>
              Messages will appear here
            </p>
          }       
        </div>
    )
}