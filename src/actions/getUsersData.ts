import * as WebSocket from "ws";
import { PlayerDataType } from "../entities/PlayerData.type";
import { players } from "../gameData";

export function getUsersData(ws: WebSocket): PlayerDataType | undefined {
  const user: PlayerDataType = Array.from(players.values()).find(
    (player) => player.ws === ws
  );

  return user;
}
