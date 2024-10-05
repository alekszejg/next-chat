"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";
import PasswordChecklist from "./passwordRequirements";
import InputField from "@/app/(auth)/_components/inputField";
import Button from "@/app/_layoutComponents/button";
import SignInWithGoogleButton from "@/app/(auth)/_components/signInGoogleButton";
import styling from "@/app/(auth)/twStyling";
import prepSignupData from "@/app/_actions/handleSignup";


export type SignupFormInputs = {name: string, email: string, password: string, reEmail: string};


export default function RegistrationPage() {
    const { 
        register, 
        handleSubmit, 
        reset, 
        getValues, 
        formState: { errors, isSubmitting } 
    } = useForm<SignupFormInputs>({mode: "onBlur"});
    

    const [password, setPassword] = useState("");
    const [passwordPopup, showPasswordPopup] = useState(false);


    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        const response = await prepSignupData(data)
        
        if (!response) {
            toast.error("Authentication failed");
            return "Authentication Error: couldn't verify your credentials. Please try again";
        } 
    }

    return (
        <form method="post" onSubmit={handleSubmit((data) => onSubmit(data))} className={styling.form.form}>

            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Register</h2>
                
                <InputField placeholder="Name:" type="text" Icon={CircleUserRound} styling={styling.input} 
                {...register('name', {required: "Name is required"})}/>
                {errors.name && <p className={styling.input.error}>{errors.name.message}</p>}
                
                <InputField placeholder="Enter email:" type="text" Icon={Mail} styling={styling.input} 
                    {...register('email', {
                        required: "Email is required", 
                        validate: (value) => {
                            if (!value.includes('@')) {
                                return "Email must contain '@' symbol";
                            }
                            return true;
                        }
                    })}
                /> 
                {errors.email && <p className={styling.input.error}>{errors.email.message}</p>}
                       
                <InputField placeholder="Repeat email:" type="text" Icon={Repeat} styling={styling.input} 
                    {...register('reEmail', {
                        required: "Email is required", 
                        validate: (value) => {
                            if (value !== getValues('email')) {
                                return "Confirmation email must match original email";
                            } else return true;
                        }
                    })}
                />
                {errors.reEmail && <p className={styling.input.error}>{errors.reEmail.message}</p>} 
                
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                    {...register('password', {
                        required: "Password is required", 
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                        },
                        maxLength: {
                            value: 100,
                            message: "Password must be below 100 characters"
                        },
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value)
                            !passwordPopup && showPasswordPopup(true)
                        },
                        onBlur: () => showPasswordPopup(false)
                    })}
                />
                {errors.password && <p className={styling.input.error}>{errors.password.message}</p>} 
                
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isSubmitting} disabled={isSubmitting} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>

                <SignInWithGoogleButton />
            </div>
            
            {passwordPopup && <PasswordChecklist password={password} />}
                
        </form>
    );
}