import { WebSocket } from "ws";

export function sendError(ws: WebSocket, message: String) {
  ws.send(JSON.stringify({ type: "error", message }));
}
