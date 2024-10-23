import * as WebSocket from "ws";
import { NewUser } from "../dto/NewUser.dto";
import { GameDto } from "../dto/Game.dto";
import { DataType } from "../entities/Data.type";
import { sendError } from "../actions/sendError";
import {
  registration,
  currentUser,
} from "../actions/registration";
import { createRoom } from "../actions/createRoom";
import { updateWinnners } from "../actions/updateWinners";
import { addShips } from "../actions/addShips";
import { updateRoom } from "../actions/updateRoom";
import { attack } from "../actions/attack";
import { PlayerAttackDto } from "../dto/PlayerAttack.dto";
import { RandomAttackDto } from "../dto/RandomAttack.dto";
import { randomAttack } from "../actions/randomAttack";
import { addUserToRoom } from "../actions/addUserToRoom";
import { AddUserToRoomDto } from "../dto/AddUserToRoom.dto";

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
      addUserToRoom(data as AddUserToRoomDto);
      break;
    case "add_ships":
      addShips(data.data as GameDto);
      break;
    case 'attack':
      attack(data as PlayerAttackDto);
      break;
    case 'randomAttack':
      randomAttack(data as unknown as RandomAttackDto);
      break;
    case "update_room":
      updateRoom();
      break;

    default:
      sendError(ws, "Unknown message type");
  }
}
