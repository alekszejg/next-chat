import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";
import InputField from "@/app/(auth)/_components/inputField";
import Button from "@/app/_layoutComponents/button";
import SignInWithGoogleButton from "@/app/(auth)/_components/signInGoogleButton";
import PasswordChecklist from "@/app/(auth)/_components/passwordChecklist";
import { emailValidator, passwordValidator } from "@/app/_actions/clientFormValidation";
import styling from "@/app/(auth)/twStyling";


export const metadata: Metadata = {
    title: "Register - NextChat"
};


export type PasswordRules = {status: boolean, requirement: string}[];

const passwordRules: PasswordRules = [
    {status: false, requirement: 'At least one lower case letter [a-z]'},
    {status: false, requirement: 'At least one upper case letter [A-Z]'},
    {status: false, requirement: 'At least one numeral [0-9]'},
    {status: false, requirement: 'At least one symbol [!@#^&*()+_,.{}?-]'},
    {status: false, requirement: 'Minimum 8 characters'},
    {status: false, requirement: 'Maximum 20 characters'}
];

type RegisterFormInputs = {name: string, email: string, password: string, repeatEmail: string, username?: string};

export default function RegistrationPage() {
    
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({mode: 'onBlur' });
    
    const handleEmailFeedback = async(email: string | undefined) => {
        const res = await emailValidator(email);
        
        if (res !== true) {
            toast.error(res);
        } else {
            toast.success("Email is valid");
            return true;
        }
    }

    const [passwordPopup, togglePasswordPopup] = useState({criteria: passwordRules, open: false});
    
    const handlePasswordFeedback = async(password: string) => {
        const res = await passwordValidator(password, passwordRules);
       
        if (Array.isArray(res)) {
            togglePasswordPopup({criteria: res, open: true})
        } 

        else if (typeof res === "string" && passwordPopup.open) {
            togglePasswordPopup({...passwordPopup, open: false})
            toast.error(res);
        } 

        else if (res === true) {
            togglePasswordPopup({...passwordPopup, open: false})
            return true;
        }
    }

    const handlePasswordBlur = () => {
        passwordPopup.open && togglePasswordPopup({...passwordPopup, open: false});
    }

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        const { name, email, repeatEmail, password } = data;

        setIsLoading(true);    
        const response = await signIn('credentials', {redirect: false, name, email, repeatEmail, password});
        setIsLoading(false);

        if (response?.error) {
            console.error("Registration error: ", response.error);
            toast.error("Registration error");
        } 
        else {toast.success("Registration was successful!");}
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styling.form.form}>

            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Register</h2>
                
                <InputField placeholder="Name:" type="text" Icon={CircleUserRound} styling={styling.input} 
                {...register('name', {required: "Name is required"})}/>
                
                <InputField placeholder="Enter email:" type="text" Icon={Mail} styling={styling.input} 
                {...register('email', {required: "Email is required", validate: handleEmailFeedback})}/>
                
                <InputField placeholder="Repeat email:" type="text" Icon={Repeat} styling={styling.input} 
                {...register('repeatEmail', {required: "Email is required", validate: handleEmailFeedback})}/> 
                
                
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                {...register('password', {
                    required: "Password is required", 
                    validate: handlePasswordFeedback,
                    onChange: handlePasswordFeedback,
                    onBlur: handlePasswordBlur
                })} />
                
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isLoading} disabled={isLoading} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>

                <SignInWithGoogleButton />
            </div>
            {passwordPopup.open && <PasswordChecklist criteria={passwordPopup.criteria} />} 
        </form>
    );
}