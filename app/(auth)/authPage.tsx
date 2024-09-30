import Button from "../_layoutComponents/button";
import InputField from "./inputField";
import { Mail, Lock} from "lucide-react";

export default function AuthPage(props: {action: "register" | "login"}) {
    const styling = {
        form: "flex justify-center",
        login: {
            header: "mx-auto text-3xl",
            wrapper: "flex flex-col gap-y-5"
        },
        input: {
            wrapper: "flex flex-row items-center",
            icon: "inline-block w-[2rem] mr-2",
            input: "h-[2rem] px-1.5",
            error: ""
        },
        button: "self-center w-3/4 h-[2rem] border-2 border-[hsl(249,3%,60%)] rounded-lg"
    } 
    
    return (
        <form className="flex justify-center items-center">
            {props.action === "login" &&
            <div className={styling.login.wrapper}>
                <h2 className={styling.login.header}>Login</h2>
                <InputField placeholder="Enter email:" type="email" Icon={Mail} styling={styling.input} />
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} />
                <Button text="Submit" className={styling.button} isLoading={false} />
            </div>
            }
        </form>
    );
}