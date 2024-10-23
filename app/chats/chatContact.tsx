"use client"
import Image from "next/image"
import { useState } from "react";
import { Circle, CircleCheck, MessageCircle } from "lucide-react";
import type { Session } from "next-auth";
import type { Contact } from "@/app/friends/contactsInfo";


type ChatContactProps = {
    session: Session | null, 
    info: Contact, 
    wrapperStyling: string, 
    handleUserSelection: (mode: "add" | "remove", userID: string) => void;
    passChatID: (chatID: string) => void;
}


export default function ChatContact(props: ChatContactProps) {
    const { session, handleUserSelection, wrapperStyling } = props;
    const { id, name, email, image } = props.info;
    
    const [selected, setSelected] = useState(false);
    const handleSelect = () => {
        selected ? handleUserSelection("remove", id) : handleUserSelection("add", id);
        setSelected(!selected)
    };

    const handleChatCreation = async () => {
        console.log("triggered chat creation")
        const url = "http://localhost:3000/api/chats";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'userID': session ? session.id : "",
                'contactID': id,
                'chatType': "DM",
            })
        });
        const data = await response.json();
        if (response.ok) {
            props.passChatID(data.chatID);
        }
    };

    const styling = {
        image: "rounded-full",
        name: "relative bottom-2 opacity-90 text-sm",
        buttonWrapper: "flex gap-x-2 ml-auto mr-3",
        selectButton: "w-[1.2rem] h-[1.2rem]",
        selectIcon: selected ? "w-full h-full" : "w-full h-full opacity-40",
        sendMessageButton: "w-[1.2rem] h-[1.2rem]",
        sendMessageIcon: "w-full h-full"
    };

    return (
        <div className={wrapperStyling}>
            <Image className={styling.image} src={image} width={30} height={30} alt={name} />
            <h3 className={styling.name}>{name}</h3>
            
            <div className={styling.buttonWrapper}>
                
                <button className={styling.selectButton} onClick={handleSelect}>
                    {!selected && <Circle className={styling.selectIcon} />}
                    {selected && <CircleCheck className={styling.selectIcon} />}
                </button>

                <button className={styling.sendMessageButton} onClick={handleChatCreation}>
                    <MessageCircle className={styling.sendMessageIcon} />
                </button>
            </div>

        </div>
    )
}