"use server";
import { FieldValues } from 'react-hook-form';
import { sanitizeInput } from "@/app/_utils/handleRawInput";
import { hashPassword } from '@/app/_actions/bcryptHash';
import addNewUser from '@/app/_actions/addNewUser';


export type SignupResponse = {
    submitted: boolean,
    badInput: {name: boolean, email: boolean, password: boolean},
    badInputExists: boolean
    emailExists: boolean,
    internal: boolean
}

const signupResponse: SignupResponse = {
    submitted: false,
    badInput: {name: false, email: false, password: false},
    badInputExists: false,
    emailExists: false,
    internal: false
};


export default async function handleSignup(rawData: FieldValues): Promise<SignupResponse> {
    const { name, email, password } = rawData;
    
    const [cleanName, cleanEmail, cleanPassword] = sanitizeInput([name, email, password]);
    
    if (!cleanName || !cleanEmail || !cleanPassword) {
        signupResponse.badInputExists = true;
        if (!cleanName) signupResponse.badInput.name = true;
        if (!cleanPassword) signupResponse.badInput.password = true;
        if (!cleanEmail) {
            signupResponse.badInput.email = true;
            return signupResponse; // Can't check for uniqueness if falsy
        }
    }
    
    // Verify email uniqueness
    try {
        const url = process.env.DOMAIN + `/api/user?email=${cleanEmail}`
        const response = await fetch(url, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
            }});
        const data = await response.json();
        
        if (response.ok && data.userExists) {
            signupResponse.emailExists = true
            return signupResponse;
        } 
        else if (signupResponse.badInputExists) return signupResponse;
      
        else if (!response.ok) {
            console.error("Unexpected error: either during data fetching from GET /api/user?email or it was accessed with invalid parameters from handleSignup() action");
            signupResponse.internal = true;
            return signupResponse;
        }
    } 
    
    catch {
        console.error("Either sanitizeInput() action call or fetching GET /api/user?email failed in handleSignup() action");
        signupResponse.internal = true;
        return signupResponse;
    }
    
    // Hash password and POST data
    try {
        const hashedPassword = await hashPassword(cleanPassword as string);
        
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [cleanName, cleanEmail, hashedPassword]
        const response = await addNewUser(query, values as string[])
        
        if (response.submitted) signupResponse.submitted = true
        else signupResponse.internal = true;
    
        return signupResponse;
    }

    catch {
        console.error("Failed to reach hashPassword() action or contact addNewUser() action");
        signupResponse.internal = true;
        return signupResponse;
    }
}

