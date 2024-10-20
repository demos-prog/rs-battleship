import { WebSocketServer } from "ws";
import * as WebSocket from "ws";
import { sendError } from "./actions/sendError";
import { DataType } from "./entities/Data.type";
import { handleMessage } from "./handlers/messageHandler";
import { httpServer } from "./httpServer";

export const wss = new WebSocketServer({ server: httpServer });

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
    // Handle player disconnection
    // Remove player from rooms, games, etc.
  });
});
