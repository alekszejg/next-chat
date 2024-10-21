"use client"
import { useState } from "react";
import type { Session } from "next-auth";
import MiniUserProfile from "@/app/chats/miniUserProfile";
import InputField from "@/app/(auth)/_components/inputField";
import { Search, Circle, CircleCheck, MessageSquarePlus } from "lucide-react";


export default function ChatsMenu(props: {session: Session | null, ContactList: React.ReactNode, ChatList: React.ReactNode}) {
    const [showContacts, setShowContacts] = useState(false);
    const toggleContacts = () => setShowContacts(!showContacts);
  
    const styling = {
        mainWrapper: "flex flex-col w-2/5 h-full border-r-2 border-r-borderWhite relative",
        profileWrapper: "flex items-center gap-x-4 h-16 pl-5 border-b-2 border-b-borderWhite",
        searchBarWrapper: "flex items-center pr-3 border-b-2 border-b-borderWhite",
        searchBar: {
            wrapper: "flex items-center gap-x-3 h-12 pl-5",
            input: "w-full h-[2rem] pr-2 bg-inherit focus:text-[1.05rem] focus:outline-0 placeholder:opacity-70", 
            icon: "inline-block w-[1.2rem] opacity-60", 
            error: "text-red-500"
        },
        addChatIcon: showContacts ? "w-[1.5rem]" : "w-[1.5rem] opacity-60",
        contactsWrapper: showContacts ? "block w-full" : "hidden"
    };


    
    return (
        <div className={styling.mainWrapper}>
            
            <div className={styling.profileWrapper}>
                <MiniUserProfile session={props.session} />
            </div>
            
            <div className={styling.searchBarWrapper}>
                <InputField placeholder="Search for chat, people or groups" Icon={Search} styling={styling.searchBar} />
                <MessageSquarePlus className={styling.addChatIcon} onClick={toggleContacts} />
            </div>

            {showContacts && 
                <section className={styling.contactsWrapper}>
                    {props.ContactList}
                </section>
            }

            {props.ChatList}
        </div>
    );
}