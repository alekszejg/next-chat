import { auth } from "@/auth";
import type { Session } from "next-auth";
import ChatClientWrapper from "@/app/chats/chatClientWrapper";
import ChatList from "@/app/chats/chatList";

export default async function ChatsPage({ searchParams }: {searchParams?: {chatID?: string}}) {
    const session: Session | null = await auth();;
    
    const styling = {
        wrapper: "flex"
    }

    return (
        <div className={styling.wrapper}>
            <ChatClientWrapper session={session} ChatList={<ChatList session={session} />} />
        </div>
    );
}