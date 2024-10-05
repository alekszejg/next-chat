import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ConnectPgsqlPool from '@/postgres';
import { PoolClient } from 'pg';


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (!email && !username) {
        const error = "Invalid query parameters";
        return NextResponse.json({error: error}, {status: 400});
    }

    let client: PoolClient | null = null;

    try {
        client = await ConnectPgsqlPool("connect");
        if (!client) {
            console.error("Returned PoolClient is null at GET /api/user");
            return NextResponse.json({error: "Internal Error"}, {status: 500});
        }
    } 

    catch (error) {
        console.error("Failed to reach ConnectPgsqlPool() function at GET /api/user");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }

    try {
        if (email) {
            const query = 'SELECT * FROM users WHERE email = $1';
            const response = await client.query(query, [email]);
            return NextResponse.json({userExists: response.rows.length > 0}, {status: 200});
        } 
        else if (username) {
            const query = 'SELECT * FROM users WHERE username = $1';
            const response = await client.query(query, [username]);
            return NextResponse.json({userExists: response.rows.length > 0}, {status: 200});
        } 
        else {
            console.error("Unexpected error at GET /api/user db query, when either email or username passed checks");
            return NextResponse.json({error: "Invalid query parameters."}, {status: 400});
        }
    } 
    
    catch {
        console.error("Database query failed at GET /api/user db query");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}
