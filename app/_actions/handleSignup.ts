"use server";
import { NextResponse } from 'next/server';
import { sanitizeInput } from "@/app/_actions/handleRawInput";
import { hashPassword } from '@/app/_actions/bcryptHash';
import type { SignupFormInputs } from "@/app/(auth)/register/page";


// HTTP 400: badInput, HTTP 409: emailExists
const clientErrors = {
    badInput: {
        name: {status: false, message: "Name contains illegal characters"},
        email: {status: false, message: "Email contains illegal characters"},
        password: {status: false, message: "Password contains illegal characters"},
    },
    emailExists: {status: false, message: "Email already exists. Add another one or login instead"},
};

// HTTP 500 
const serverError = {message: "Internal error has occured. Try again later"};


export default async function handleSignup(rawData: SignupFormInputs) {
    const { name, email, password } = rawData;
    
    // error states
    let badInput = false;
    let emailExists= false;
    let internalError = false;

    // scope change for another try block
    let safeName: string | undefined;
    let safeEmail: string | undefined;
    let safePassword: string | undefined; 

    try {
        // Sanitize inputs
        const [cleanName, cleanEmail, cleanPassword] = await sanitizeInput([name, email, password])
        if (!cleanName || !cleanEmail || !cleanPassword) {
            badInput = true;
            !cleanName && (clientErrors.badInput.name.status = true);
            !cleanEmail && (clientErrors.badInput.email.status = true);
            !cleanPassword && (clientErrors.badInput.password.status = true);
        }

        // scope change for another try block
        cleanName && (safeName = cleanName);
        cleanEmail && (safeEmail = cleanEmail);
        cleanPassword && (safePassword = cleanPassword);

        // Ensure email is unique
        if (cleanEmail) {
            const url = process.env.DOMAIN + `/api/user?email=${email}`
            const response = await fetch(url, {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
            });
            
            const data = await response.json();

            switch (response.status) {
                case 200: 
                    if (data.userExists) {
                        emailExists = true;
                        clientErrors.emailExists.status = true;
                        return NextResponse.json(clientErrors, {status: 400});
                    }
                    break;

                case 400:
                    console.error("Unexpected error for GET /api/user?email accessed with invalid parameters from handleSignup() action");
                case 500:
                    console.error("Internal db related error when fetching GET /api/user?email from handleSignup() action")
                
                default:
                    internalError = true;
                    return NextResponse.json(clientErrors, {status: 400}); 
            }
        }
    }

    catch {
        internalError = true;
        console.error("Either sanitizeInput() action call or fetching GET /api/user?email failed in handleSignup() action");
        NextResponse.json(serverError, {status: 500});
    }
    

    if (badInput || emailExists) {
        return NextResponse.json(clientErrors, {status: 400});
    } else if (internalError) {
        return NextResponse.json(serverError, {status: 500});
    }

    // proceed with hashing password when no more client errors left
    else {
        try {
            const hashedPassword = await hashPassword(safePassword as string);
        }

        catch {
            console.error("Failed to reach hashPassword() action or add data to DB");
            NextResponse.json(serverError, {status: 500});
        }
    }
}

