"use client"
import { useEffect } from "react";
import { socket } from "@/app/socket";

export default function Chat() {
    useEffect(() => {
        // Connect the socket when the component mounts
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
        <div>This is the chat section</div>
    )
}