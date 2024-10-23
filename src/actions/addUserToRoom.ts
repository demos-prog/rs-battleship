import { rooms } from "../gameData";
import * as WebSocket from "ws";
import { createGame } from "./createGame";
import { currentUser } from "./registration";
import { updateRoom } from "./updateRoom";

export function addUserToRoom(
  ws: WebSocket,
  data: { indexRoom: number | string }
) {
  let index: string;
  if (typeof data === "string") {
    index = JSON.parse(data).indexRoom;
  } else if (typeof data.indexRoom === "string") {
    index = data.indexRoom;
  } else {
    console.error("Invalid indexRoom type");
    return;
  }

  const room = rooms.get(index);
  if (!room) {
    console.error("Room not found");
    return;
  }

  if (room.roomUsers[0].index === currentUser.index) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: "You are already in this room",
        id: 0,
      })
    );
    console.log("You are already in this room");
    return;
  }

  room.roomUsers.push({
    name: currentUser.name,
    index: currentUser.index,
  });

  rooms.set(index, room);
  console.log('Add user to room');
  updateRoom();
  createGame(index);
}