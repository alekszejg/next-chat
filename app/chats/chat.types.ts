import { User } from "next-auth";

// Anyone local can create || Anyone local can search || Owner can delete
export interface Message {
    id: number,
    content: string,
    creator_id: User, // ref users table primary key
    created_at: string,
    chat_id: Chat // chat contains many Message[], ref chats table primary key
}

// Anyone can create || Anyone local can find || Admin(s) can edit and delete
export interface Chat {
    id: string,
    creator_id: User, // ref users table primary key
    created_at: string,
    title: string | null // >2 participants
}

// Anyone can create || Anyone local can find || Admin(s) can edit and delete
export interface ChatParticipants {
    // PRIMARY KEY (chat_id, user_id)
    chat_id: number, // ref chats table primary key 
    user_id: User, // ref users table primary key 
    is_admin: boolean 
}

export interface ChatList {
    id: number,
    chats: Chat[]
}