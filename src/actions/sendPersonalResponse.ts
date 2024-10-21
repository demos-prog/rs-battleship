import { CreatedUser } from "../dto/CreatedUser.dto";
import * as WebSocket from "ws";

export function sendPersonalResponse(
  ws: WebSocket,
  type: string,
  data: CreatedUser
) {
  const response = JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
  console.log("Sent: ", type);
  
  ws.send(response);
}
