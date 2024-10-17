"use client"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Session } from "next-auth";
import InputField from "@/app/(auth)/_components/inputField";
import { Search, UserRoundPlus } from "lucide-react";


export default function myFriendsHeader(props: {session: Session | null}) {
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

    const { register, watch } = useForm({mode: "onChange"});

    const userSearch = watch("userSearch");
    
    useEffect(() => {
        if (!userSearch) return;
        const searchFriend = async () => {
            const input = encodeURIComponent(userSearch);
            const url =  `http://localhost:3000/api/user?user=${props.session?.id}&search-for=friend&input=${input}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = response.json();
            console.log(data)
        }
        searchFriend();
        
    }, [userSearch])

    return (
        <>
        <h2 className={styling.header}>My Friends</h2>
        <div className={styling.peopleSearchWrapper.wrapper}>
            
            <button className={styling.peopleSearchWrapper.addFriendButton}>
                <UserRoundPlus className={styling.peopleSearchWrapper.addFriendIcon} />
            </button>
            
            <InputField placeholder="Find a friend" Icon={Search} styling={styling.peopleSearchWrapper.friendSearch} 
                {...register('userSearch', {})}
            />
        </div>
        </>
    );
}