import { auth } from "@/auth";
import MyFriendsHeader from "@/app/friends/myFriendsHeader";
import ContactsInfo from "@/app/friends/contactsInfo";
import PeopleList from "@/app/friends/peopleList";

export default async function FriendsPage() {
    const session = await auth();

    const styling = {
        wrapper: "",
        headerWrapper: "flex justify-between items-center h-12 border-b-2 border-b-borderWhite", 
    };

    return (
        <div className={styling.wrapper}>
            
            <div className={styling.headerWrapper}>
                <MyFriendsHeader session={session} />
            </div>

            <ContactsInfo session={session} />

            
        </div>
    );
}