"use client"
import Image from "next/image"
import { useState } from "react";
import { Circle, CircleCheck, MessageCircle } from "lucide-react";
import type { Contact } from "@/app/friends/contactsInfo";


export default function ChatContact(props: {info: Contact, wrapperStyling: string, handleUserSelection: (mode: "add" | "remove", userID: string) => void;}) {
    const { id, name, email, image } = props.info;
    
    const [selected, setSelected] = useState(false);
    const handleSelect = () => {
        if (!selected) {
            props.handleUserSelection("add", id);
        } else {
            props.handleUserSelection("remove", id);
        }
        setSelected(!selected)
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
        <div className={props.wrapperStyling}>
            <Image className={styling.image} src={image} width={30} height={30} alt={name} />
            <h3 className={styling.name}>{name}</h3>
            
            <div className={styling.buttonWrapper}>
                
                {!selected && 
                    <button className={styling.selectButton} onClick={handleSelect}>
                        <Circle className={styling.selectIcon} />
                    </button>
                }

                {selected && 
                    <button className={styling.selectButton} onClick={handleSelect}>
                        <CircleCheck className={styling.selectIcon} />
                    </button>
                }

                <button className={styling.sendMessageButton}>
                    <MessageCircle className={styling.sendMessageIcon} />
                </button>
            </div>

        </div>
    )
}