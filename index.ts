import "dotenv/config";
import { WebSocketServer } from "ws";
import * as WebSocket from "ws";
import { sendError } from "./src/actions/sendError";
import { DataType } from "./src/entities/Data.type";
import { handleMessage } from "./src/handlers/messageHandler";
import { httpServer } from "./src/httpServer";

export const wss = new WebSocketServer({ server: httpServer });
const HTTP_PORT = process.env.HTTP_PORT;

wss.on("connection", (ws: WebSocket) => {
  console.log("New connection");

  ws.addEventListener("message", (event) => {
    try {
      const parsedData: DataType = JSON.parse(event.data as string);
      handleMessage(ws, parsedData);
    } catch (error) {
      console.error("Error parsing message:", error);
      sendError(ws, "Invalid message format");
    }
  });

  ws.addEventListener("close", () => {
    console.log("Connection closed.");
    ws.terminate();
    // Handle player disconnection
    // Remove player from rooms, games, etc.
  });
});

const shutdown = () => {
  console.log("Shutting down WebSocket server...");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });
  wss.close(() => {
    console.log("WebSocket server closed.");
    process.exit(0);
  });
  console.log("Waiting for connections to close...");
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", () => {
  console.log("Process is exiting...");
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});
