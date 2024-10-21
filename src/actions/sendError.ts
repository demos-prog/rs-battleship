import { WebSocket } from "ws";

export function sendError(ws: WebSocket, message: String) {
  console.log("error");
  ws.send(JSON.stringify({ type: "error", message }));
}
