import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ConnectPgsqlPool from '@/postgres';


export async function GET(req: NextRequest) {
    console.log("\n\nAccessed get route\n\n")
    const searchParams = req.nextUrl.searchParams;
    const searchByEmail = searchParams.get('email');
    const searchByUsername = searchParams.get('username');

    if (!searchByEmail && !searchByUsername) {
        return NextResponse.json({error: "Incorrect search query. Ensure that query params are valid"}, {status: 500});
    }

    const client = await ConnectPgsqlPool("connect");
    if (!client) {
        return NextResponse.json({error: "Connection to database failed. Try again later"}, {status: 500});
    }
    
    let query = "";
    if (searchByEmail) {query = 'SELECT * FROM users WHERE email = $1';}
    else if (searchByUsername) {query = 'SELECT * FROM users WHERE username = $1';}

    try {
        const response = await client.query(query, [searchByEmail || searchByUsername]);
        ConnectPgsqlPool("disconnect", client);
        return NextResponse.json({exists: response.rows.length > 0}, {status: 200});
    } 
    catch {
        return NextResponse.json({error: "Database query failed. Try again later"}, {status: 500});
    } 
}
