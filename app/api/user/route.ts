import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ConnectPgsqlPool from '@/postgres';


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (!searchParams || !email && !username) {
        const error = "Incorrect query parameters";
        return NextResponse.json({error: error}, {status: 500});
    }

    try {
        const client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            const error = "Connection to database failed";
            return NextResponse.json({error: error}, {status: 500});
        }

        try {
            let query: string;
            let queryParams: string[];
            
            if (email) {
                query = 'SELECT * FROM users WHERE email = $1';
                queryParams = [email];
            } else if (username) {
                query = 'SELECT * FROM users WHERE username = $1';
                queryParams = [username];
            } else {
                const error = "Incorrect query parameters";
                return NextResponse.json({error: error}, {status: 500});
            }
            
            const response = await client.query(query, queryParams);
            ConnectPgsqlPool("disconnect", client);
            return NextResponse.json({userExists: response.rows.length > 0}, {status: 200});
        }
        catch {
            const error = "Database query has failed";
            return NextResponse.json({error: error}, {status: 500});
        }
    }
    catch {
        const error = "Failed to reach ConnectPgsqlPool() function";
        return NextResponse.json({error: error}, {status: 500});
    } 
}
