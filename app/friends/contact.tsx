import Image from "next/image";
import { XCircle, MessageSquareMore, Phone} from "lucide-react";

export default function Contact(props: {image: string, name: string}) {
    const styling = {
        wrapper: "flex flex-col items-center py-3 border-2 rounded-xl border-borderWhite relative",
        removeFriendButton: "w-[1.4rem] absolute left-[6.5rem] bottom-[7rem] opacity-60 hover:scale-110 active:scale-110",
        removeFriendIcon: "w-full h-full",
        contactImg: "rounded-full",
        nameHeader: "text-center text-lg",
        buttonWrapper: "flex gap-x-2"
    }

    return (
        <div className={styling.wrapper}>
            <button className={styling.removeFriendButton}>
                <XCircle className={styling.removeFriendIcon} />
            </button>
            <Image className={styling.contactImg} src={props.image} width={50} height={50} alt={props.name} />
            <h3 className={styling.nameHeader}>{props.name}</h3>
            <div className={styling.buttonWrapper}>
                <button><MessageSquareMore /></button>
                <button><Phone /></button>
            </div>
        </div>
    );
}