import { ReactNode } from "react";
import Sidebar from "./sidebar";

export default function PageLayout(props: {children: ReactNode}) {
    const styling = {
        main: "grid grid-cols-clientLayout h-full"
    };

    return (
        <main className={styling.main}>
            <Sidebar />
            {props.children}
        </main>
    );
}