import { RoomType } from "../entities/Room.type";
import WebSocket from "ws";
import crypto from "crypto";
import { updateRoom } from "./updateRoom";
import { players, rooms } from "../gameData";
import { PlayerDataType } from "../entities/PlayerData.type";

export function createRoom(ws: WebSocket) {
  const user: PlayerDataType = Array.from(players.values()).find(
    (player) => player.ws === ws
  );

  const newRoom: RoomType = {
    roomId: crypto.randomUUID(),
    roomUsers: [
      {
        name: user.name,
        index: user.index,
      },
    ],
  };

  rooms.set(newRoom.roomId, newRoom);
  console.log('Create room');
  updateRoom();
}
