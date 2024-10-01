import Link from "next/link";
import Button from "../_layoutComponents/button";
import SignInWithGoogleButton from "./signInGoogleButton";
import InputField from "./inputField";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";

export default function AuthPage({action}: {action: "register" | "login"}) {
    const styling = {
        form: {
            form: "flex justify-center items-center",
            contentWrapper: "flex flex-col gap-y-5",
            header: "mx-auto text-3xl",
            button: "self-center w-3/4 h-[2rem] border-2 border-[hsl(249,3%,60%)] rounded-lg",
            alreadyRegisteredText: "text-[hsl(249,0%,61%)]",
            loginLink: "ml-3 text-[hsl(249,0%,90%)] hover:underline"
        },
        input: {
            wrapper: "flex flex-row items-center",
            icon: "inline-block w-[2rem] mr-1.5",
            input: "h-[2rem] px-1.5",
            error: ""
        }
    } 
    
    return (
        <form className={styling.form.form}>
            
            {action === "register" &&
            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Register</h2>
                <InputField placeholder="Name:" type="text" Icon={CircleUserRound} styling={styling.input} />
                <InputField placeholder="Enter email:" type="email" Icon={Mail} styling={styling.input} />
                <InputField placeholder="Repeat email:" type="email" Icon={Repeat} styling={styling.input} /> 
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} />
                <Button text="Submit" className={styling.form.button} isLoading={false} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>
                <SignInWithGoogleButton />
            </div> 
            }

            {action === "login" &&
            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Login</h2>
                <InputField placeholder="Enter email:" type="email" Icon={Mail} styling={styling.input} />
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} />
                <Button text="Submit" className={styling.form.button} isLoading={false} />
            </div>
            }
        </form>
    );
}