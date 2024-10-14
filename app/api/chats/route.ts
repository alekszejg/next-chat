import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import ConnectPgsqlPool from "@/postgres";


export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const userID = req.headers.get('userID');
    const searchParams = req.nextUrl.searchParams;
    const chatID = searchParams.get('chatID');

    if (!userID || !authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.API_KEY) {
        console.error("Get route received no authorization")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client: PoolClient | null = null;

    try {
        client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            console.error("Returned PoolClient is null at GET /api/chats");
            return NextResponse.json({error: "Internal Error"}, {status: 500});
        }

        if (chatID) {
            const response = await client.query('SELECT * FROM chats WHERE id = $1', [chatID]);
            ConnectPgsqlPool("disconnect", client);
            if (response.rows.length === 0) {
                return NextResponse.json({chatExists: false}, {status: 200});
            } else {
                return NextResponse.json({chat: response.rows[0], chatExists: true}, {status: 200})
            }
        } 
        
        const query = 'SELECT c.* FROM chats c JOIN chat_participants cp ON c.id = cp.chat_id WHERE cp.user_id = $1 AND cp.chat_visible = true';
        const response = await client.query(query, [userID]);
        ConnectPgsqlPool("disconnect", client);
        
        if (response.rows.length === 0) {
            return NextResponse.json({chatsExist: false}, {status: 200});
        } else {
            return NextResponse.json({chatsExist: true, chats: response.rows}, {status: 200});
        }  
    } 

    catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform GET /api/chats");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}

export async function PATCH(req: NextRequest) {
    console.log("API RECEIVED REQUEST")
    //const authHeader = req.headers.get('Authorization');
    const userID = req.headers.get('userID');
    const searchParams = req.nextUrl.searchParams;
    const chatID = searchParams.get('chatID');

    if (!userID) {
        console.error("Get route received no authorization")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client: PoolClient | null = null;

    try {
        client = await ConnectPgsqlPool("connect");
        
        if (!client) {
            console.error("Returned PoolClient is null at PATCH /api/chats");
            return NextResponse.json({error: "Internal Error"}, {status: 500});
        }

        if (chatID && userID) {
            const query = 'UPDATE chat_participants SET chat_visible = false WHERE user_id = $1 AND chat_id = $2;';
            await client.query(query, [userID, chatID]);
            ConnectPgsqlPool("disconnect", client);
            return NextResponse.json({chatHidden: true}, {status: 200});
        } else {
            return NextResponse.json({chatHidden: false}, {status: 500});
        }
    } 

    catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform GET /api/chats");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}
