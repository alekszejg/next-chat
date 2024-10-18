import type { Session } from "next-auth";
import Contact from "./contact";

type Friend = {id: string, name: string, email: string, image: string};


export default async function FriendList({ session }: {session: Session | null}) {
    let friendList: Friend[] | [] = [];
    const url = `http://localhost:3000/api/contacts?user=${session?.id}&status=friends`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            friendList = data.matches;
        }
    }
    
    return (
        <>
        {friendList.length > 0 && friendList.map(friend => (
            <Contact key={friend.id} name={friend.name} image={friend.image} />
        ))}
        </>
    );
}