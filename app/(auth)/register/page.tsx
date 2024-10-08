"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CircleUserRound, Mail, Repeat, Lock} from "lucide-react";
import InputField from "@/app/(auth)/_components/inputField";
import Button from "@/app/_layoutComponents/button";
import SignInWithGoogleButton from "@/app/(auth)/_components/signInGoogleButton";
import styling from "@/app/(auth)/twStyling";
import prepSignupData from "@/app/_actions/handleSignup";
import { signIn } from "next-auth/react";

export type SignupFormInputs = {name: string, email: string, password: string, reEmail: string};


export default function RegistrationPage() {
    const router = useRouter();

    const { 
        register, 
        handleSubmit, 
        reset, 
        getValues, 
        formState: { errors, isSubmitting } 
    } = useForm<SignupFormInputs>({mode: "onChange"});
    
    const [submitErrors, setSubmitErrors] = useState({
        nameInput: "", 
        emailInput: "", 
        passwordInput: "",
        emailExists: "",
        internal: ""  
    });
    
    
    const onSubmit = async (formInputs: FieldValues) => {
        const response = await prepSignupData(formInputs);
        
        if (response.submitted) {
            const performAuth = await signIn('credentials', {
                redirect: false,
                email: getValues("email"),
                password: getValues("password"),
            });

            if (performAuth) {
                console.log("Everything is authorized")
                toast.success("Registration Successful");
                reset();
                router.push("/login")
            } else {
                toast.error("Failed to authorize");
                setSubmitErrors(prev => ({
                    ...prev, internal: "Error occured during registration. Try again later"
                }));
            }
        }
            
        
        else if (!response.internal && response.badInputExists || response.emailExists) {
            toast.error("Invalid information provided");
            setSubmitErrors({
                nameInput: response.badInput.name ? "Name contains illegal characters" : "",
                emailInput: response.badInput.email ? "Email contains illegal characters": "",
                passwordInput: response.badInput.password? "Password contains illegal characters": "",
                emailExists: response.emailExists ? "Email already exists. Add another one or login instead": "",
                internal: ""
            });
        }

        else if (response.internal) {
            toast.error("Internal error has occured");
            setSubmitErrors(prev => ({
                ...prev, internal: "Internal error has occured. Please try again later"
            }));
        }        
    }

    return (
        <form method="post" onSubmit={handleSubmit(onSubmit)} className={styling.form.form}>

            <div className={styling.form.contentWrapper}>
                <h2 className={styling.form.header}>Register</h2>
                
                <InputField placeholder="Name:" type="text" Icon={CircleUserRound} styling={styling.input} 
                {...register('name', {required: "Name is required"})}/>
                {errors.name && <p className={styling.input.error}>{errors.name.message}</p>}
                {submitErrors.nameInput && <p className={styling.input.error}>{submitErrors.nameInput}</p>}
                
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
                {submitErrors.emailInput && <p className={styling.input.error}>{submitErrors.emailInput}</p>}
                {submitErrors.emailExists && <p className={styling.input.error}>{submitErrors.emailExists}</p>}

                <InputField placeholder="Repeat email:" type="text" Icon={Repeat} styling={styling.input} 
                    {...register('reEmail', {
                        required: "Email is required", 
                        validate: (value) => {
                            if (value !== getValues('email')) {
                                return "Confirmation email must match original email";
                            } else return true;
                        },
                        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                            if (e.target.value !== getValues('email')) {
                                return "Confirmation email must match original email"
                            } else return true;
                        }
                    })}
                />
                {errors.reEmail && <p className={styling.input.error}>{errors.reEmail.message}</p>} 
                
                <InputField placeholder="Enter password:" type="password" Icon={Lock} styling={styling.input} 
                    {...register('password', {
                        required: "Password is required", 
                        validate: {
                            hasLowerCase: (value) => /[a-z]/.test(value) || "must have a lowercase leter",
                            hasUppercase: (value) => /[A-Z]/.test(value) || "must have an uppercase leter",
                            hasNumber: (value) => /[0-9]/.test(value) || "must have a number",
                            hasSymbol: (value) => /[!@#^&*()+_,.{}?-]/.test(value) || "must have a symbol (!@#^&*()+_,.{}?-)",
                            inRange: (value) => {if (value.length < 8 || value.length > 20) return "must be between 8 and 20 characters"}
                        }
                    })}
                />
                {errors.password && <p className={styling.input.error}>{errors.password.message}</p>}
                {submitErrors.passwordInput && <p className={styling.input.error}>{submitErrors.passwordInput}</p>}
                
                <Button type="submit" text="Submit" className={styling.form.button} isLoading={isSubmitting} disabled={isSubmitting} /> 
                <p className={styling.form.alreadyRegisteredText}>Already have an account? 
                    <Link className={styling.form.loginLink} href="/login">Login</Link>
                </p>
                {submitErrors.internal && <p className={styling.input.error}>{submitErrors.internal}</p>}

                <SignInWithGoogleButton />
            </div>
             
        </form>
    );
}