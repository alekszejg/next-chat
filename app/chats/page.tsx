import { auth } from "@/auth";
import type { Session } from "next-auth";
import ChatsMenu from "@/app/chats/chatsMenu";

export default async function ChatsPage() {
    const session: Session | null = await auth();
    
    const styling = {
        wrapper: "flex flex-col"
    }

    return (
        <div className={styling.wrapper}>
            <ChatsMenu session={session} />
        </div>
    );
}