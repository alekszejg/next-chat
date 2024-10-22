"use client"
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import type { Contact } from "@/app/friends/contactsInfo";
import ChatContact from "@/app/chats/chatContact";

type ContactListProps = {
    session: Session | null,
    passChatID: (chatID: string) => void
}


export default function ContactList(props: ContactListProps) {
    const styling = {
        createGroupChatButton: "mt-3 ml-3",
        contactWrapper: "flex items-center gap-x-3 h-14 pl-3 border-b-2 border-b-borderWhite",
        addFriends: "mt-5 text-center opacity-60",
        internalError: "text-center opacity-60"
    };

    let internalError = false;
    const [contactList, setContactList] = useState<Contact[]>([]);
    
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const url = `http://localhost:3000/api/contacts?user=${props.session?.id}&status=friends`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    data.match && setContactList(data.matches);
                }
                
                if (!response.ok) {
                    internalError = true;
                }

            } catch {
                internalError = true;
                console.error(`Failed to fetch contacts for user ${props.session?.id}`)
            }
        }
        fetchContacts();
    }, []);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    const handleUserSelection = (mode: "add" | "remove", userID: string) => {
        setSelectedUsers((prevSelectedUsers) => {
            if (mode === "add") return [...prevSelectedUsers, userID]
            return prevSelectedUsers.filter(id => id !== userID);
        })
    }

    return (
        <>
        {internalError && 
            <p className={styling.internalError}>Couldn't load the friend list. Try again later</p>
        }

        {!internalError && contactList.length === 0 &&
            <p className={styling.addFriends}>Add more friends to chat with</p>
        }

        {!internalError && contactList.length > 0 && 
            <>
            <button className={styling.createGroupChatButton}>Create a groupchat ({selectedUsers.length} selected)</button>
            {contactList.map(contact => (
                <ChatContact key={contact.id} session={props.session} info={contact} wrapperStyling={styling.contactWrapper} handleUserSelection={handleUserSelection} passChatID={props.passChatID}/>
            ))}
            </>
        }
        </>
        
    );

}
