import { AddUserToRoomDto } from "../dto/AddUserToRoom.dto";
import { rooms } from "../gameData";
import { createGame } from "./createGame";
import { currentUser } from "./registration";
import { updateRoom } from "./updateRoom";

export function addUserToRoom(dto: AddUserToRoomDto) {
  let data = dto.data;
  if (typeof dto.data === "string") {
    data = JSON.parse(dto.data);
  }
  console.log('name- ', currentUser.name);
 
  
  const indexRoom = data.indexRoom;

  const room = rooms.get(indexRoom);
  if (!room) {
    console.error("Room not found");
    return;
  }

  room.roomUsers.push({
    name: currentUser.name,
    index: currentUser.index,
  });

  rooms.set(indexRoom, room);
  console.log("Add user to room");
  updateRoom();
  createGame(indexRoom);
}
