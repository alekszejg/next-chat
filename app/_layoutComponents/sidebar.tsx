"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun } from "lucide-react";
import { routes } from "./sidebar.data";


export default function Sidebar() {
    const styling = {
        aside: "flex flex-col justify-between items-center h-full py-6 border-r-2 border-borderWhite",
        buttonMenu: "flex flex-col items-center gap-y-8",
        icon: "text-[hsl(249,4%,50%)] hover:text-[hsl(249,4%,100%)]",
        activeIcon: "text-[hsl(249,4%,100%)]"
    }

    const currentPath = usePathname();

    return (
        <aside className={styling.aside}>
             <Sun className={styling.icon} />
             <div className={styling.buttonMenu}>
                {routes.map(route => (
                    <Link href={route.url} key={route.title}>
                        <route.icon className={currentPath === route.url ? styling.activeIcon : styling.icon} />
                    </Link>
                ))}
             </div>
            <Image width={32} height={32} src="/icons/nextChatLogo.svg" alt="logo" priority/>
        </aside>
    );
}