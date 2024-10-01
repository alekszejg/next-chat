import { Toaster } from "react-hot-toast";
import Sidebar from "./sidebar";


export default function PageLayout(props: {children: React.ReactNode}) {
    const styling = {
        main: "grid grid-cols-clientLayout h-full",
        errorToaster: "w-[100px] bg-white"
    
    };

    return (
        <main className={styling.main}>
            <Sidebar />
            {props.children}
            <Toaster position="top-right" />
        </main>
    );
}