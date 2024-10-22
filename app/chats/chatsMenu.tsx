"use client"
import Image from "next/image";
import { useState } from "react";
import type { Session } from "next-auth";
import InputField from "@/app/(auth)/_components/inputField";
import { Search, MessageSquarePlus } from "lucide-react";
import ContactList from "./contactsList";


type ChatsMenuProps = {
    session: Session | null, 
    ChatList: React.ReactNode
    passChatID: (chatID: string) => void
}

export default function ChatsMenu(props: ChatsMenuProps) {
    const [showContacts, setShowContacts] = useState(false);
    const toggleContacts = () => {
        console.log("contacts toggled")
        setShowContacts(!showContacts);
    }
    const styling = {
        mainWrapper: "flex flex-col w-2/5 h-full border-r-2 border-r-borderWhite relative",
        userProfile: {
            wrapper: "flex items-center gap-x-4 h-16 pl-5 border-b-2 border-b-borderWhite",
            image: "rounded-full relative",
            name: "w-[100px] text-[0.9rem] text-nowrap relative bottom-1"
        },
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
            
            <div className={styling.userProfile.wrapper}>
                <Image src={props.session?.user?.image || "/images/defaultUserImage.avif"} className={styling.userProfile.image} width={40} height={40} alt="Your profile picture" />
                <h3 className={styling.userProfile.name}>{props.session?.user?.name}</h3>
            </div>
            
            <div className={styling.searchBarWrapper}>
                <InputField placeholder="Search for chat, people or groups" Icon={Search} styling={styling.searchBar} />
                <MessageSquarePlus className={styling.addChatIcon} onClick={toggleContacts} />
            </div>

            {showContacts && 
                <section className={styling.contactsWrapper}>
                    <ContactList session={props.session} passChatID={props.passChatID}/>
                </section>
            }

            {props.ChatList}
        </div>
    );
}