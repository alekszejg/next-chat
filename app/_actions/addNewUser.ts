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

        const result = await client.query(query, values);
        const userID = result.rows[0].id;
        ConnectPgsqlPool("disconnect", client);
        return {submitted: true, userID: userID};
    }

    catch {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to add user to the database");
        return {submitted: false};
    }
    
}