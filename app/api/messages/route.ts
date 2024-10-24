import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import ConnectPgsqlPool from "@/postgres";

/*export async function POST(req: NextRequest) {
    const data = await req.json();
    const senderID = data.senderID;
    const content = data.content;
    const chatID = data.chatID;


    if (!senderID || !content || !chatID) {
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

        const query = "INSERT INTO messages (sender, content, chatID) VALUES ($1, $2, $3)";
        await client.query(query, [senderID, content, chatID]);
        ConnectPgsqlPool("disconnect", client);
        return NextResponse.json({success: true}, {status: 200});
    } catch (error) {
        client && ConnectPgsqlPool("disconnect", client);
        console.error("Failed to perform POST /api/messages");
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    } 
}
*/