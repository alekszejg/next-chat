import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


export let pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.DB_PORT),
});


export default async function ConnectPgsqlPool(action: "connect" | "disconnect", client: PoolClient | null = null, ) {
    
  if (action === "connect") {
      try {
          client = await pool.connect();
          return client;
      }
      catch {
          console.error("Couldn't connect to database");
          return null;
      }
  }

  else if (client && action === "disconnect") {
      client.release();
  }

  return null;
}