"use server";
import { NextResponse } from 'next/server';
import { $fetch } from "@/app/api/user/api.fetchUser";
import { sanitizeInput } from "@/app/_actions/handleRawInput";
import { hashPassword } from '@/app/_actions/bcryptHash';
import type { SignupFormInputs } from "@/app/(auth)/register/page";

type ResponseErrors = {
    inputs: {name: string[], email: string[], password: string[]}
}

export default async function prepSignupData(rawData: SignupFormInputs) {
    const { name, email, password } = rawData;
    
    const errors: ResponseErrors = {
        inputs: {name: [], email: [], password: []}
    };

    const [cleanName, cleanEmail, cleanPassword] = await sanitizeInput([name, email, password]);
    
    if (!cleanName) {
        errors.inputs.name.push("Name contains illegal characters");
    }

    if (!cleanEmail) {
        errors.inputs.email.push("Email contains illegal characters");
    }

    if (!cleanPassword) {
        errors.inputs.password.push("Password contains illegal characters");
    }

    // Verify uniqueness of email 
    if (cleanEmail) {
        const getUserResponse = await $fetch.get({email: cleanEmail});
        const data = await getUserResponse.json();
        
        if (getUserResponse.ok && data.exists) {
            errors.inputs.email.push("This email already exists")
            return "This email already exists";
        } 
    }

    // Hash password 
    if (cleanPassword) {
        const hashRequest = await hashPassword(cleanPassword)
    }
}

