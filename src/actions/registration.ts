import { v4 as uuidv4 } from "uuid";
import * as WebSocket from "ws";
import {
  createGame,
  players,
  rooms,
  sendPersonalResponse,
  updateRoom,
  updateWinnners,
} from "../..";
import { CreatedUser } from "../dto/CreatedUser.dto";
import { NewUser } from "../dto/NewUser.dto";
import { sendError } from "./sendError";

export let currentUser: CreatedUser = {
  name: "",
  index: "",
  error: false,
  errorText: "",
};

export function registration(ws: WebSocket, data: NewUser) {
  let usersData: NewUser;
  if (typeof data === "string") {
    try {
      usersData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing NewUser data:", error);
      sendError(ws, "Invalid NewUser data format");
      return;
    }
  } else {
    usersData = data;
  }

  const playerId = uuidv4();
  players.set(playerId, { ws, name: usersData.name });

  const createdUser: CreatedUser = {
    name: usersData.name,
    index: playerId,
    error: false,
    errorText: "No errors",
  };

  currentUser = createdUser;
  sendPersonalResponse(
    ws as unknown as import("ws").WebSocket,
    "reg",
    createdUser
  );
  updateRoom();
  updateWinnners();
}

// add youself to somebodys room, then remove the room from available rooms list
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
  updateRoom();
  createGame(index);
}
