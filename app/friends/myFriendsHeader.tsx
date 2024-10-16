import InputField from "@/app/(auth)/_components/inputField";
import { Search, UserRoundPlus } from "lucide-react";

export default function myFriendsHeader() {
    const styling = {
        header: "pl-6 text-2xl",
        peopleSearchWrapper: {
            wrapper: "flex items-center gap-x-2",
            addFriendButton: "w-4 h-4 opacity-60",
            addFriendIcon: "w-full h-full",
            friendSearch: {
                wrapper: "flex items-center gap-x-1.5 h-12",
                input: "w-full h-[2rem] pr-5 bg-inherit focus:text-[1.05rem] focus:outline-0 placeholder:opacity-70", 
                icon: "inline-block w-[1.2rem] opacity-60", 
                error: "text-red-500"
            }
        }
    };

    return (
        <>
        <h2 className={styling.header}>My Friends</h2>
        <div className={styling.peopleSearchWrapper.wrapper}>
            <button className={styling.peopleSearchWrapper.addFriendButton}>
                <UserRoundPlus className={styling.peopleSearchWrapper.addFriendIcon} />
            </button>
            <InputField placeholder="Find a friend" Icon={Search} styling={styling.peopleSearchWrapper.friendSearch} />
        </div>
        </>
    );
}