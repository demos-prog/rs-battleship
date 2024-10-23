import * as WebSocket from "ws";

export interface PlayerDataType {
  ws: WebSocket;
  name: string;
  password: string;
  index: string | number;
}
