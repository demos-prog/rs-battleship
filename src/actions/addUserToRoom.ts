import { AddUserToRoomDto } from "../dto/AddUserToRoom.dto";
import * as WebSocket from "ws";
import { createGame } from "./createGame";
import { updateRoom } from "./updateRoom";
import { getUsersData } from "./getUsersData";
import { rooms } from "../gameData";

export function addUserToRoom(ws: WebSocket, dto: AddUserToRoomDto) {
  let data = dto.data;
  if (typeof dto.data === "string") {
    data = JSON.parse(dto.data);
  }

  const user = getUsersData(ws);
  const indexRoom = data.indexRoom;

  const room = rooms.get(indexRoom);
  if (!room) {
    console.error("Room not found");
    return;
  }

  room.roomUsers.push({
    name: user?.name,
    index: user?.index,
  });

  rooms.set(indexRoom, room);
  console.log("Add user to room");
  updateRoom();
  createGame(indexRoom);
}
