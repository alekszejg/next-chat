import type { Session } from "next-auth";
import { auth } from "@/auth";
import type { Chat } from "./chat.types";
import ChatPreview from "./chatPreview";

export default async function ChatList() {
    const session: Session | null = await auth();
    let internalError = false;
    let chatList: Chat[] | [] = [];
   
    const styling = {
        chat: "h-12 border-b-2 border-b-borderWhite",
        noChatsFound: "mt-5 text-center opacity-60",
        internalError: "mt-5 text-center text-sm opacity-60"
    }

    try {
        const url =  process.env.DOMAIN + "/api/chats";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`, 
                'Content-Type': 'application/json',
                'userID': session ? session.id : ""   
            } 
        });

        if (!response.ok) {
            internalError = true;
        }

        const data = await response.json();
        if (data.chatsExist) chatList = data.chats

    } catch (error) {
        internalError = true
        console.error(`Fetch to GET /chats failed for user: ${session?.id}`, error); 
    }
   
    return (
        <div>
            {!internalError && chatList.length === 0 && 
                <p className={styling.noChatsFound}>No chats were found</p>
            }
            
            {!internalError && chatList.length > 0 && 
            chatList.map(chat => (
                <ChatPreview key={chat.id} styling={styling.chat} chatID={`ChatID: ${chat.id}`} />
            ))}
            
            {internalError && 
                <p className={styling.internalError}>Couldn't load the chats. Try again later</p>
            }
        </div>
    );
}