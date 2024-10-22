"use client"
import type { Session } from "next-auth";
import { useState } from "react";
import ChatsMenu from "@/app/chats/chatsMenu";
import Chat from "@/app/chats/chat";


export default function ChatClientWrapper ({ session, ChatList }: {session: Session | null, ChatList: React.ReactNode}) {
    const [chatID, setChatID] = useState<string | null>(null);
    const passChatID = (chatID: string) => setChatID(chatID);
    
    return (
        <>
        <ChatsMenu session={session} ChatList={ChatList} passChatID={passChatID} />
        <Chat session={session} chatID={chatID} />
        </>
    );
}
    
