"use server"
import type { PoolClient } from "pg";
import ConnectPgsqlPool from "@/postgres";


export default async function addNewUser(query: string, values: string[]) {
    let client: PoolClient | null = null;
    
    try {
        client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            console.error("Returned PoolClient is null at GET /api/user");
            return {submitted: false};
        }

        await client.query(query, values);
        ConnectPgsqlPool("disconnect", client);
        return {submitted: true};
    }

    catch {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to add user to the database");
        return {submitted: false};
    }
    
}