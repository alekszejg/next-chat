"use server";
import { sanitizeInput } from "@/app/_utils/handleRawInput";
import { hashPassword } from '@/app/_actions/bcryptHash';
import ConnectPgsqlPool from '@/postgres';
import { PoolClient } from 'pg';
import { FieldValues } from 'react-hook-form';


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
        if (!cleanEmail) signupResponse.badInput.email = true;
        if (!cleanPassword) signupResponse.badInput.password = true;
    }
    
    if (!cleanEmail) return signupResponse; // Can't verify email if input is falsy
      
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
            return signupResponse;
        }
    } 
    
    catch {
        console.error("Either sanitizeInput() action call or fetching GET /api/user?email failed in handleSignup() action");
        signupResponse.internal = true;
        return signupResponse;
    }
    
    
    // Hash password and POST data
    let client: PoolClient | null = null;
    try {
        const hashedPassword = await hashPassword(cleanPassword as string);
        client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            console.error("Returned PoolClient is null at GET /api/user");
            signupResponse.internal = true;
            return signupResponse;
        }

        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        await client.query(query, [cleanName, cleanEmail, hashedPassword]);
        ConnectPgsqlPool("disconnect", client);
        signupResponse.submitted = true
        return signupResponse;
    }

    catch {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to reach hashPassword() action or add data to DB");
        signupResponse.internal = true;
        return signupResponse;
    }
}

