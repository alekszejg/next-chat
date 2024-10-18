import type { Session } from "next-auth";
import Contact from "./contact";

type Contact = {id: string, name: string, email: string, image: string};


export default async function PeopleList({ session, status }: {session: Session | null, status: string}) {
    let peopleList: Contact[] | [] = [];
    const url = `http://localhost:3000/api/contacts?user=${session?.id}&status=${status}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            peopleList = data.matches;
        }
    }
    
    return (
        <>
        {peopleList.length > 0 && peopleList.map(contact => (
            <Contact key={contact.id} name={contact.name} image={contact.image} />
        ))}
        </>
    );
}