import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ConnectPgsqlPool from '@/postgres';
import type { PoolClient } from 'pg';
import addNewUser from '@/app/_actions/addNewUser';

export async function GET(req: NextRequest) {
    //const authHeader = req.headers.get('Authorization');
    const searchParams = req.nextUrl.searchParams;
    const userID = searchParams.get("user");
    const searchFor = searchParams.get("search-for");
    const input = searchParams.get("input");
    const email = searchParams.get('email');
    
    let client: PoolClient | null = null;
   
    /*if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.API_KEY) {
        console.error("Get route received no authorization")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */

    if (searchFor === "friend") {
        if (userID && input) {
            let client: PoolClient | null = null;
            try {
                client = await ConnectPgsqlPool("connect");
                // ensure friendship query works in both ways (not jsut pending friend requests)
                const query = `SELECT u.id, u.name, u.email FROM users AS u 
                JOIN contacts AS c1 ON (c1.user_id = $1 AND c1.contact_id = u.id)
                JOIN contacts AS c2 ON (c2.user_id = u.id AND c2.contact_id = $1)
                WHERE (u.email LIKE $2 OR u.name LIKE $2);`;
                
                if (!client) return NextResponse.json({error: "Connection to DB failed"}, {status: 500});
                console.log("got the client")
                const response = await client.query(query, [userID, `${input}%`]);
                ConnectPgsqlPool("disconnect", client);
                if (response.rows.length === 0) return NextResponse.json({success: false}, {status: 200});
                return NextResponse.json({success: true, matches: response.rows}, {status: 200})
            } catch {
                if (client) ConnectPgsqlPool("disconnect", client);
                return NextResponse.json({error: "Either db connection or query failed"}, {status: 500});
            } 
        }
    }

    if (!email) {
        const error = "Invalid query parameter";
        return NextResponse.json({error: error}, {status: 400});
    }

    try {
        client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            console.error("Returned PoolClient is null at GET /api/user");
            return NextResponse.json({error: "Internal Error"}, {status: 500});
        }

        const response = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        ConnectPgsqlPool("disconnect", client);
        if (response.rows.length === 0) {
            return NextResponse.json({userExists: false}, {status: 200});
        } else {
            return NextResponse.json({user: response.rows[0], userExists: true}, {status: 200});
        }
        
    } 

    catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform GET /api/user");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.API_KEY) {
        console.error("POST route received no authorization")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { query, values } = body;

    if (typeof query !== 'string' || !Array.isArray(values)) {
        console.error("POST route received invalid request body format");
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const result = await addNewUser(query, values);
    
    if (result.submitted) {
        return NextResponse.json({submitted: true, userID: result.userID}, { status: 201 });
    } else {
        return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }
}





