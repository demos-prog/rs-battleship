import WebSocket from "ws";
import crypto from "crypto";
import { CreatedUser } from "../dto/CreatedUser.dto";
import { NewUser } from "../dto/NewUser.dto";
import { sendError } from "./sendError";
import { updateWinnners } from "./updateWinners";
import { sendPersonalResponse } from "./sendPersonalResponse";
import { updateRoom } from "./updateRoom";
import { players } from "../gameData";
import { PlayerDataType } from "../entities/PlayerData.type";

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

  const playerId = crypto.randomUUID();

  const existingPlayer: PlayerDataType | undefined = players.get(playerId);

  const newPlayer: PlayerDataType = {
    ws,
    name: usersData.name,
    password: usersData.password,
    index: playerId,
  };
  players.set(playerId, newPlayer);

  let createdUser: CreatedUser = {
    name: usersData.name,
    index: playerId,
    error: false,
    errorText: "No errors",
  };

  if (
    existingPlayer?.name === usersData.name &&
    existingPlayer?.password === usersData.password
  ) {
    createdUser = {
      name: existingPlayer.name,
      index: existingPlayer.index,
      error: false,
      errorText: "No errors",
    };
  }

  sendPersonalResponse(ws, "reg", createdUser);
  updateRoom();
  updateWinnners();
}
