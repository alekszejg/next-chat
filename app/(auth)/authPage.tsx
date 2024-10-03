"use client"

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../_layoutComponents/button";
import SignInWithGoogleButton from "./signInGoogleButton";
import InputField from "./inputField";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";
import { redirect } from "next/dist/server/api-utils";

type FormInputs = {email: string; password: string; repeatEmail?: string; name: string; username: string};


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
    };

    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({mode: 'onChange' });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { name, email, repeatEmail, password } = data;

        switch (action) {
            
            case "register":
                const registerResponse = await signIn('credentials', {redirect: false, name, email, repeatEmail, password});
                if (registerResponse?.error) {
                    console.error("Registration error: ", registerResponse.error);
                    toast.error("Registration error");
                } else {
                    toast.success("Registration was successful!");
                }
                break;

            case "login":
                const loginResponse  = await signIn('credentials', {redirect: false, email, password});
                if (loginResponse?.error){
                    console.error("Login error: ", loginResponse.error);
                    toast.error("Login error");
                } else {
                    toast.success("Login was successful!");
                }
                break;
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styling.form.form}>
        
            {action === "register" &&
            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Register</h2>
                <InputField placeholder="Name:" type="text" Icon={CircleUserRound} styling={styling.input} 
                {...register('name')}/>
                <InputField placeholder="Enter email:" type="text" Icon={Mail} styling={styling.input} 
                {...register('email', {required: true})}/>
                <InputField placeholder="Repeat email:" type="text" Icon={Repeat} styling={styling.input} 
                {...register('repeatEmail', {required: true})}/> 
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                {...register('password', {required: true})}/>
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={false} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>
                <SignInWithGoogleButton />
            </div> 
            }

            {action === "login" &&
            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Login</h2>
                <InputField placeholder="Enter email:" type="text" Icon={Mail} styling={styling.input} 
                {...register('email')}
                />
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                {...register('password', {required: true})}/>
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isLoading} disabled={isLoading} />
            </div>
            }
        </form>
    );
}