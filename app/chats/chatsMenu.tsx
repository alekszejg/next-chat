import type { Session } from "next-auth";
import MiniUserProfile from "@/app/chats/miniUserProfile";
import InputField from "@/app/(auth)/_components/inputField";
import { Search } from "lucide-react";


export default function ChatsMenu({ session }: {session: Session | null}) {
    
    const styling = {
        mainWrapper: "flex flex-col w-2/5 h-full border-r-2 border-r-borderWhite",
        profileWrapper: "flex items-center gap-x-4 h-16 pl-5 border-b-2 border-b-borderWhite",
        searchBar: {
            wrapper: "flex items-center gap-x-3 h-12 pl-5 border-b-2 border-b-borderWhite",
            input: "w-full h-[2rem] pr-2 bg-inherit focus:text-[1.05rem] focus:outline-0 placeholder:opacity-70", 
            icon: "inline-block w-[1.2rem] opacity-60", 
            error: "text-red-500"
        }
    };

    return (
        <div className={styling.mainWrapper}>
            <div className={styling.profileWrapper}>
                <MiniUserProfile session={session} />
            </div>
            <InputField placeholder="Search for chat, people or groups" Icon={Search} styling={styling.searchBar} />
        </div>
    );
}