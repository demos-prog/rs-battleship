import * as WebSocket from "ws";
import { NewUser } from "../dto/NewUser.dto";
import { GameDto } from "../dto/Game.dto";
import { DataType } from "../entities/Data.type";
import { sendError } from "../actions/sendError";
import {
  registration,
  addUserToRoom,
  currentUser,
} from "../actions/registration";
import { createRoom } from "../actions/createRoom";
import { updateWinnners } from "../actions/updateWinners";
import { addShips } from "../actions/addShips";
import { updateRoom } from "../actions/updateRoom";
import { attack } from "../actions/attack";
import { PlayerAttackDto } from "../dto/PlayerAttack.dto";

export function handleMessage(ws: WebSocket, data: DataType) {
  console.log("Command from client: ", data.type);
  
  switch (data.type) {
    case "reg":
      registration(ws, data.data as NewUser);
      break;
    case "create_room":
      createRoom(currentUser);
      break;
    case "update_winners":
      updateWinnners();
      break;
    case "add_user_to_room":
      addUserToRoom(ws, data.data as { indexRoom: number | string });
      break;
    case "add_ships":
      addShips(data.data as GameDto);
      break;
    case 'attack':
      attack(data as PlayerAttackDto);
      break;
    case "update_room":
      updateRoom();
      break;

    default:
      sendError(ws, "Unknown message type");
  }
}
