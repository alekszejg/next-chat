import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import ConnectPgsqlPool from '@/postgres';
import type { PoolClient } from 'pg';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userID = searchParams.get("user");
    const status = searchParams.get("status");
    if (!userID || !status) return NextResponse.json({error: "userID or status don't exist"}, {status: 401});
    
    let client: PoolClient | null = null;
    let query: string = "";
    
    try {
        client = await ConnectPgsqlPool("connect");
        if (!client) return NextResponse.json({error: "Connection to DB failed"}, {status: 500});

        switch (status) {
            case "pending":
                query = `SELECT u.id, u.name, u.email, u.image FROM users AS u
                JOIN contacts AS c ON (c.user_id = u.id AND c.contact_id = $1 AND status = 'pending');`;
                break;
            case "friends":
                query = `SELECT u.id, u.name, u.email, u.image FROM users AS u
                JOIN contacts AS c ON (c.user_id = $1 AND c.contact_id = u.id AND status = 'friends');`;
                break;
            default:
                return NextResponse.json({error: "Incorrect friendship status"}, {status: 400});
        }

        const response = await client.query(query, [userID]);
        ConnectPgsqlPool("disconnect", client);
        if (response.rows.length === 0) return NextResponse.json({match: false}, {status: 200});
        return NextResponse.json({match: true, matches: response.rows}, {status: 200});


    } catch {
        if (client) ConnectPgsqlPool("disconnect", client);
        return NextResponse.json({error: "Either db connection or query failed"}, {status: 500});
    }
};