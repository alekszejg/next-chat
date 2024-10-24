import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import ConnectPgsqlPool from "./postgres.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const startServer = async () => {
    try {
      await app.prepare();
      const httpServer = createServer(handler);
      const io = new Server(httpServer);
  
      io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
  
        socket.on("disconnect", (reason) => {
          console.log(`Socket disconnected due to: ${reason}`);
        });
  
        socket.on("newMessage", async (message) => {
          let client = null;
          try {
            client = await ConnectPgsqlPool("connect");
            if (!client) {
              console.error("Returned PoolClient is null at socket event newMessage");
              socket.emit("messageError", { error: "Couldn't connect to database" });
            } else {
              const query = "INSERT INTO messages (sender, content, chat_id) VALUES ($1, $2, $3)";
              await client.query(query, [message.senderID, message.content, message.chatID]);
              ConnectPgsqlPool("disconnect", client);
              io.emit('message', message);
            }
          } catch {
            socket.emit("messageError", { error: "Failed to save message." });
          }
        })
      });
  
      httpServer.listen(port, (error) => {
        if (error) throw error;
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  
      httpServer.once("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
      });
      
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  };
  
  // Start the server
  startServer();