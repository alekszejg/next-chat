import { auth } from "@/auth";
import type { Session } from "next-auth";
import ChatsMenu from "@/app/chats/chatsMenu";
import ChatList from "@/app/chats/chatList";
import ContactList from "@/app/chats/contactsList";
import Chat from "@/app/chats/chat";


export default async function ChatsPage({ searchParams }: {searchParams?: {chatID?: string}}) {
    const session: Session | null = await auth();
    console.log("chatid is: ", searchParams?.chatID)
    const styling = {
        wrapper: "flex"
    }

    return (
        <div className={styling.wrapper}>
            <ChatsMenu 
                session={session} 
                ContactList={<ContactList session={session}/>} 
                ChatList={<ChatList />}/>
        </div>
    );
}