"use client"
import type { Session } from "next-auth";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPreview(props: {session: Session | null, styling: string, chatID: string, text: string}) {
    const router = useRouter();

    const styling = {
        trashButton: "self-center w-[1.2rem] ml-auto mr-2 hover:scale-110",
        trashIcon: "w-full h-full opacity-60"
    };

    const handleRemoval = async () => {
        let internalError = false;
        try {
            const url = "http://localhost:3000" + `/api/chats?chatID=${props.chatID}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    //'Authorization': `Bearer ${process.env.API_KEY}`, 
                    'Content-Type': 'application/json',
                    'userID': props.session ? props.session.id : "",  
                } 
            });
    
            if (!response.ok) {
                internalError = true;
            } else {
                router.refresh();
            }
    
    
        } catch (error) {
            internalError = true
            console.error(`Fetch to PATCH /api/chats failed for user: ${props.session?.id}`, error); 
        }
    }

    return (
        <div className={props.styling}>
            {props.text}
            <button className={styling.trashButton} onClick={handleRemoval}>
                <Trash2 className={styling.trashIcon} />
            </button>
        </div>
    );
}