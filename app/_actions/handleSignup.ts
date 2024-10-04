"use server";
import { NextResponse } from 'next/server';
import { $fetch } from "@/app/api/user/api.fetchUser";
import { sanitizeInput } from "@/app/_actions/handleRawInput";
import { hashPassword } from '@/app/_actions/bcryptHash';
import type { SignupFormInputs } from "@/app/(auth)/register/page";


// statusCodes: {400: maliciousInput, 409: emailExists, 500: internal}
type SignupErrors = {
    maliciousInput: {
        name: {status: boolean, message: "Name contains illegal characters" | ""},
        email: {status: boolean, message: "Email contains illegal characters" | ""},
        password: {status: boolean, message: "Password contains illegal characters" | ""},
    }
    emailExists: {status: boolean, message: "Email already exists. Specify another email or login instead" | ""}
    internal: {status: boolean, message: "Internal error has occured. Try again later" | ""}
    statusCode: undefined | 400 | 409 | 500 
}


export default async function handleSignup(rawData: SignupFormInputs) {
    const { name, email, password } = rawData;

    // Determines whether to attempt signup or send errors to client
    let maliciousInputError = false;
    let emailExistsError = false;
    let internalError = false;

    // For client to locate error quickly
    const errorResponse: SignupErrors = {
        maliciousInput: {
            name: {status: false, message: ""},
            email: {status: false, message: ""},
            password: {status: false, message: ""},
        },
        emailExists: {status: false, message: ""},
        internal: {status: false, message: ""},
        statusCode: undefined 
    };

    // Handling malicious input 
    const [cleanName, cleanEmail, cleanPassword] = await sanitizeInput([name, email, password]);
    switch (undefined) {
        case cleanName: 
            !maliciousInputError && (maliciousInputError = true)
            errorResponse.maliciousInput.name.status = true;
            errorResponse.maliciousInput.name.message = "Name contains illegal characters";
            break;
        case cleanEmail:
            !maliciousInputError && (maliciousInputError = true)
            errorResponse.maliciousInput.email.status = true;
            errorResponse.maliciousInput.email.message = "Email contains illegal characters";
            break;
        case cleanPassword: 
            !maliciousInputError && (maliciousInputError = true)
            errorResponse.maliciousInput.password.status = true;
            errorResponse.maliciousInput.password.message = "Password contains illegal characters";
            break;
    }

    // Check email's uniqueness
    if (cleanEmail) {
        const getUserResponse = await $fetch.get({searchBy: "email", email: cleanEmail});
        const data = await getUserResponse.json();
        
        if (!getUserResponse.ok) {
            internalError = true;

            errorResponse.emailExists.status = true;
            errorResponse.emailExists.message = "Email already exists. Specify another email or login instead";
            return "This email already exists";
        } 
    }

    // Hash password 
    if (cleanPassword) {
        const hashRequest = await hashPassword(cleanPassword)
    }
}

