import MyFriendsHeader from "@/app/friends/myFriendsHeader";
import Contact from "@/app/friends/contact";

export default function FriendsPage() {
    const styling = {
        wrapper: "",
        headerWrapper: "flex justify-between items-center h-12 border-b-2 border-b-borderWhite", 
        friendListWrapper: "grid grid-cols grid-cols-[repeat(auto-fit,120px)] gap-8 mt-6 px-6"
    };

    return (
        <div className={styling.wrapper}>
            <div className={styling.headerWrapper}>
                <MyFriendsHeader />
            </div>
            <div className={styling.friendListWrapper}>
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
                <Contact image="/images/defaultUserImage.avif" name="Alex" />
            </div>
        </div>
    );
}