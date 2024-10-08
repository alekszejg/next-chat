"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock} from "lucide-react";
import InputField from "@/app/(auth)/_components/inputField";
import Button from "@/app/_layoutComponents/button";
import styling from "@/app/(auth)/twStyling";


type FormInputs = {email: string, password: string};

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("callbackUrl");
    

    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({mode: 'onBlur' });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { email, password } = data;
        setIsLoading(true); 
        const response  = await signIn('credentials', {callbackUrl: redirectUrl || "/chats", email, password});
        setIsLoading(false);

        if (response) {
            toast.success("Login was successful!");
        } else {
            console.error("Login error");
            toast.error("Login error");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styling.form.form}>
            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Login</h2>
                
                <InputField placeholder="Enter email:" type="text" Icon={Mail} styling={styling.input} 
                {...register('email', {required: true})}/>
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                {...register('password', {required: true})}/>
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isLoading} disabled={isLoading} />
            </div>
        </form>
    )
}