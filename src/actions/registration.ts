import { v4 as uuidv4 } from "uuid";
import * as WebSocket from "ws";
import { CreatedUser } from "../dto/CreatedUser.dto";
import { NewUser } from "../dto/NewUser.dto";
import { sendError } from "./sendError";
import { updateWinnners } from "./updateWinners";
import { sendPersonalResponse } from "./sendPersonalResponse";
import { updateRoom } from "./updateRoom";
import { players } from "../gameData";

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
  players.set(playerId, {
    ws,
    name: usersData.name,
    password: usersData.password,
  });

  const createdUser: CreatedUser = {
    name: usersData.name,
    index: playerId,
    error: false,
    errorText: "No errors",
  };

  currentUser = createdUser;
  sendPersonalResponse(ws, "reg", createdUser);
  updateRoom();
  updateWinnners();
}
