import Image from "next/image";
import { MessageSquareMore, Phone} from "lucide-react";

export default function Contact(props: {image: string, name: string}) {
    const styling = {
        wrapper: "flex flex-col items-center py-3 border-2 rounded-xl border-borderWhite",
        contactImg: "rounded-full",
        nameHeader: "text-center text-lg",
        buttonWrapper: "flex gap-x-2"
    }

    return (
        <div className={styling.wrapper}>
            <Image className={styling.contactImg} src={props.image} width={50} height={50} alt={props.name} />
            <h3 className={styling.nameHeader}>{props.name}</h3>
            <div className={styling.buttonWrapper}>
                <button><MessageSquareMore /></button>
                <button><Phone /></button>
            </div>
        </div>
    );
}