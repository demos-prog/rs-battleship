import { AddUserToRoomDto } from "../dto/AddUserToRoom.dto";
import * as WebSocket from "ws";
import { players, rooms } from "../gameData";
import { createGame } from "./createGame";
import { updateRoom } from "./updateRoom";
import { PlayerDataType } from "../entities/PlayerData.type";

export function addUserToRoom(ws: WebSocket, dto: AddUserToRoomDto) {
  let data = dto.data;
  if (typeof dto.data === "string") {
    data = JSON.parse(dto.data);
  }

  const user: PlayerDataType = Array.from(players.values()).find(
    (player) => player.ws === ws
  );

  const indexRoom = data.indexRoom;

  const room = rooms.get(indexRoom);
  if (!room) {
    console.error("Room not found");
    return;
  }

  room.roomUsers.push({
    name: user.name,
    index: user.index,
  });

  rooms.set(indexRoom, room);
  console.log("Add user to room");
  updateRoom();
  createGame(indexRoom);
}
