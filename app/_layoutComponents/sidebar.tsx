import Link from "next/link";
import Image from "next/image";
import routes from "@/app/allRoutes.json";
import { Sun, UserRoundSearch, MessageSquare, Phone, Settings } from "lucide-react";

export default function Sidebar() {
    const styling = {
        aside: "flex flex-col justify-between items-center h-full py-6 border-r-2 border-borderWhite",
        buttonMenu: "flex flex-col items-center gap-y-8",
        icon: "text-[hsl(249,4%,50%)] hover:text-[hsl(249,4%,100%)]"
    }

    return (
        <aside className={styling.aside}>
             <Sun className={styling.icon} />
             <div className={styling.buttonMenu}>
                <Link href={routes.features.friends}><UserRoundSearch className={styling.icon}/></Link>
                <Link href={routes.features.chats}><MessageSquare className={styling.icon} /></Link>
                <Link href={routes.features.calls}><Phone className={styling.icon} /></Link>
                <Link href={routes.features.settings}><Settings className={styling.icon} /></Link>
             </div>
            <Image width={32} height={32} src="/icons/nextChatLogo.svg" alt="logo" priority/>
        </aside>
    
    );
}