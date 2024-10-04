"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";
import PasswordChecklist from "./passwordChecklist";
import InputField from "@/app/(auth)/_components/inputField";
import Button from "@/app/_layoutComponents/button";
import SignInWithGoogleButton from "@/app/(auth)/_components/signInGoogleButton";
import styling from "@/app/(auth)/twStyling";


export type SignupFormInputs = {name: string, email: string, password: string, reEmail: string};
export type PasswordChecklist = {status: boolean, requirement: string}[] | [];

export default function RegistrationPage() {
    
    const { 
        register, 
        handleSubmit, 
        reset, 
        getValues, 
        formState: { errors, isSubmitting } 
    } = useForm<SignupFormInputs>();
    
    const [password, setPassword] = useState("");
    const initialChecklist = [
        {status: /[a-z]/.test(password), requirement: 'At least one lower case letter [a-z]'},
        {status: /[A-Z]/.test(password), requirement: 'At least one upper case letter [A-Z]'},
        {status: /[0-9]/.test(password), requirement: 'At least one numeral [0-9]'},
        {status: /[!@#^&*()+_,.{}?-]/.test(password), requirement: 'At least one symbol [!@#^&*()+_,.{}?-]'}
    ];

    const [passwordChecklist, setPasswordChecklist] = useState(initialChecklist);
    const [passwordPopupVisible, setPasswordPopup] = useState(false);
    
    const tests = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#^&*()+_,.{}?-]/];

    useEffect(() => {
        let updateChecklist: boolean = false;

        if (password) {
            const debounceTimer = setTimeout(() => {
                const newChecklist = passwordChecklist.map((obj, index) => {
                    let newStatus: boolean = obj.status;
                    
                    if (tests[index].test(password) !== obj.status) {
                        newStatus = !obj.status;
                        updateChecklist = true;
                    } 
                    return {...obj, status: newStatus};
                });
    
                updateChecklist && setPasswordChecklist(newChecklist);

            }, 600);
            
            return () => clearTimeout(debounceTimer);
        }
    }, [password])


    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        const { name, email, reEmail, password } = data;
        const response = await signIn('credentials', {redirect: false, name, email, password});
    
        if (!response) {
            toast.error("Authentication failed");
            return "Authentication Error: couldn't verify your credentials. Please try again";
        } 

        else if (!response.ok) {
            toast.error("Authentication error has occured");
            console.error("Authentication error: ", response.error);
            return response.error;
        }

        else {
            toast.success("Registration Successful");
            setTimeout(() => {
                reset()
            }, 1000);
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
                    })}
                    onBlur={() => {
                        const email = getValues('email');
                        if (!email.includes('@')) return "Emails must contain '@' symbol";
                    }}
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
                    onBlur={() => {
                        const emailValue1 = getValues('email');
                        const emailValue2 = getValues('reEmail');
                        if (emailValue1 !== emailValue2) return "Confirmation email must match original email";
                    }}
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
                        }
                    })}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const newPassword = event.target.value;
                        setPassword(newPassword);
                    }}
                    onBlur={() => setPasswordPopup(false)} 
                />
                {errors.password && <p className={styling.input.error}>{errors.password.message}</p>} 
                
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isSubmitting} disabled={isSubmitting} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>

                <SignInWithGoogleButton />
            </div>
            
            {passwordPopupVisible && toast.custom(<PasswordChecklist checklist={passwordChecklist} />)}
                
        </form>
    );
}