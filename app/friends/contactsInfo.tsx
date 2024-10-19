import { Session } from "next-auth";
import Contact from "@/app/friends/contact";

type Contact = {id: string, name: string, email: string, image: string};


export default async function ContactsInfo({ session }: {session: Session | null}) {
    const [resPending, resFriends] = await Promise.allSettled([
        fetch(`http://localhost:3000/api/contacts?user=${session?.id}&status=pending`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }),
        fetch(`http://localhost:3000/api/contacts?user=${session?.id}&status=friends`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ])

    let pendingList: Contact[] | [] = [];
    if (resPending.status === "fulfilled" && resPending.value.ok) {
        const data = await resPending.value.json(); 
        data.match && (pendingList = data.matches);
    }

    let friendList: Contact[] | [] = [];
    if (resFriends.status === "fulfilled" && resFriends.value.ok) {
        const data = await resFriends.value.json();
        data.match && (friendList = data.matches);
    }
    

    const styling = {
        requests: {
            section: pendingList.length > 0 ? "flex flex-col" : "hidden",
            header: "pl-6 text-2xl",
            grid: "grid grid-cols grid-cols-[repeat(auto-fit,120px)] gap-8 mt-6 px-6"
        },
        friends: {
            section: "flex flex-col",
            header: "pl-6 text-2xl",
            grid: friendList.length > 0 ? "grid grid-cols grid-cols-[repeat(auto-fit,120px)] gap-8 mt-6 px-6" : "hidden",
            noFriendsFound: friendList.length > 0 ? "hidden" : "pl-6 mt-1.5 text-sm opacity-30"
        }
    }

    return (
        <>
        <section className={styling.requests.section}>
            <h2 className={styling.requests.header}>Wants to be your friend</h2>
            <div className={styling.requests.grid}>
                {pendingList.length > 0 && pendingList.map(contact => (
                    <Contact key={contact.id} name={contact.name} image={contact.image} status="pending"/>
                ))}
            </div>
        </section>

        <section className={styling.friends.section}>
            <h2 className={styling.friends.header}>My Friends</h2>
            <p className={styling.friends.noFriendsFound}>Added friends will appear here</p>
            <div className={styling.friends.grid}>
                {friendList.length > 0 && friendList.map(contact => (
                    <Contact key={contact.id} name={contact.name} image={contact.image} status="friend" />
                ))}
            </div>
        </section>
        </>
    );


}