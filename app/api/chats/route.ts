import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import ConnectPgsqlPool from "@/postgres";


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userID = searchParams.get('userID');
    const chatID = searchParams.get('chatID');

    if (!userID) {
        console.error("Unauthorized user")
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
            const chatResponse = await client.query('SELECT * FROM chats WHERE id = $1', [chatID]);
            const messagesResponse = await client.query("SELECT * FROM messages WHERE chat_id = $1", [chatID]);
            ConnectPgsqlPool("disconnect", client);
            return NextResponse.json({
                chat: chatResponse.rows[0],
                messages: messagesResponse.rows
            }, {status: 200});
        } 

        else if (!chatID) {
            const query = 'SELECT c.* FROM chats c JOIN chat_participants cp ON c.id = cp.chat_id WHERE cp.user_id = $1 AND cp.chat_visible = true';
            const response = await client.query(query, [userID]);
            ConnectPgsqlPool("disconnect", client);
            
            if (response.rows.length > 0) {
                return NextResponse.json({chatsExist: true, chats: response.rows}, {status: 200});
            }
            return NextResponse.json({chatsExist: false}, {status: 200});
        }
    } catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform GET /api/chats");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const userID = data.userID;
    const contactID = data.contactID;
    const chatType: "DM" | "group" = data.chatType;

    if (!userID || !contactID || !chatType) {
        console.error("Unauthorized user")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let client: PoolClient | null = null;

    try {
        client = await ConnectPgsqlPool("connect");
    
        if (!client) {
            console.error("Returned PoolClient is null at POST /api/chats");
            return NextResponse.json({error: "Internal Error"}, {status: 500});
        }

        const chatExistsQuery = `SELECT * FROM chats c
                    JOIN chat_participants cp1 ON c.id = cp1.chat_id
                    JOIN chat_participants cp2 ON c.id = cp2.chat_id
                    WHERE c.participant_count = 2 
                    AND cp1.user_id = $1
                    AND cp2.user_id = $2`;
        
        const chatExistsResponse = await client.query(chatExistsQuery, [userID, contactID]);
        if (chatExistsResponse.rows.length > 0) {
            return NextResponse.json({chatID: chatExistsResponse.rows[0].id}, {status: 200})
        }

        const addChatQuery = `INSERT INTO chats (creator_id, participant_count) VALUES ($1, 2) RETURNING id;`
        const addChatResponse = await client.query(addChatQuery, [userID]);
        const chatID = addChatResponse.rows[0].id;
        const addParticipantsQuery = `INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)`;
        await client.query(addParticipantsQuery, [chatID, userID, contactID]);
        ConnectPgsqlPool("disconnect", client);
        return NextResponse.json({chatID: chatID}, {status: 200});
    } catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform GET /api/chats");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}


export async function PATCH(req: NextRequest) {
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
