import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";

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
  
        // Add more event handlers as needed
      });
  
      httpServer.listen(port, (err) => {
        if (err) throw err;
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