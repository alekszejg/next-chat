"use client"
import { useState, useEffect, useRef } from "react";
import { socket } from "@/app/socket";
import type { Session } from "next-auth";
import type { Message } from "@/app/chats/chat.types";
import { SendHorizonal } from "lucide-react";

type User = {id: string, name: string, email: string, image: string};
type UserInfo = {name: string, email: string, image: string}

export default function Chat({ session, chatID }: {session: Session | null, chatID: string | null}) {
    const styling = {
      wrapper: chatID ? "flex flex-col w-full h-screen" : "hidden",
      noMessages: "text-sm, text-center, opacity-60",
      error: "text-sm, text-center, opacity-60",
      messages: {
        form: "flex justify-center mt-auto",
        textArea: "block w-2/3 max-h-[150px] resize-none",
        sendButton: "w-[1.5rem] ml-5 mb-3 self-end",
        sendIcon: "w-full h-full"
      }
    }
    
    let userInfo: {[key: string]: UserInfo} = {};
    const [messages, setMessages] = useState<Message[] | []>([]);
    const [error, setError] = useState<null | string>(null);
    
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
        setMessages(data.messages);
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
          setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        return () => {
          socket.off("message");
          socket.disconnect()
        };
        
    }, [chatID]);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const handleMessageInput = () => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.style.height = "auto"; 
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      console.log("onsubmit got triggered")
      event.preventDefault();
      const newMessage = {
        senderID: session?.id || "",
        content: textAreaRef.current?.value,
        chatID: chatID
      };
      socket.emit('newMessage', newMessage);
    }

    return (
        <div className={styling.wrapper}>
          
          {error && <p className={styling.error}>{error}</p>}
          
          {!error && messages.length === 0 && 
            <p className={styling.noMessages}>
              Messages will appear here
            </p>
          }
          <form className={styling.messages.form} onSubmit={onSubmit}>
            <textarea 
            ref={textAreaRef}
            placeholder="Type a message" 
            onInput={handleMessageInput} 
            className={styling.messages.textArea} />
            <button type="submit" className={styling.messages.sendButton}>
              <SendHorizonal className={styling.messages.sendIcon} />
            </button>
          </form>       
        </div>
    )
}