import { auth } from "@/auth";
import MyFriendsHeader from "@/app/friends/myFriendsHeader";
import PeopleList from "@/app/friends/peopleList";

export default async function FriendsPage() {
    const session = await auth();

    const styling = {
        wrapper: "",
        headerWrapper: "flex justify-between items-center h-12 border-b-2 border-b-borderWhite", 
        incomingRequests: {
            section: "flex flex-col",
            header: "pl-6 text-2xl",
            grid: "grid grid-cols grid-cols-[repeat(auto-fit,120px)] gap-8 mt-6 px-6"
        },
        friends: {
            section: "flex flex-col",
            header: "pl-6 text-2xl",
            grid: "grid grid-cols grid-cols-[repeat(auto-fit,120px)] gap-8 mt-6 px-6"
        }
    };

    return (
        <div className={styling.wrapper}>
            
            <div className={styling.headerWrapper}>
                <MyFriendsHeader session={session} />
            </div>

            <section className={styling.incomingRequests.section}>
                <h2 className={styling.incomingRequests.header}>Wants to be your friend</h2>
                <div className={styling.incomingRequests.grid}>
                    <PeopleList session={session} status="pending" />
                </div>
            </section>

            <section className={styling.friends.section}>
                <h2 className={styling.friends.header}>My Friends</h2>
                <div className={styling.friends.grid}>
                    <PeopleList session={session} status="friends" />
                </div>
            </section>
        </div>
    );
}