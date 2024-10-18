import { auth } from "@/auth";
import MyFriendsHeader from "@/app/friends/myFriendsHeader";
import FriendList from "@/app/friends/friendList";

export default async function FriendsPage() {
    const session = await auth();

    const styling = {
        wrapper: "",
        headerWrapper: "flex justify-between items-center h-12 border-b-2 border-b-borderWhite", 
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
            <section className={styling.friends.section}>
                <h2 className={styling.friends.header}>My Friends</h2>
                <div className={styling.friends.grid}>
                    <FriendList session={session} />
                </div>
            </section>
        </div>
    );
}