import { User } from "next-auth";

export interface ChatMessage {
    id: string,
    content: string,
    sender: User
    sentAt: string,
}

export interface RecentChats {
    id: string,
    messages: ChatMessage[],
    participants: User[] // for personal chats .length === 1
}