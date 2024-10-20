import * as WebSocket from "ws";
import { NewUser } from "../dto/NewUser.dto";
import { createRoom, addShips, updateRoom, updateWinnners } from "../..";
import { GameDto } from "../dto/Game.dto";
import { DataType } from "../entities/Data.type";
import { sendError } from "../actions/sendError";
import {
  registration,
  addUserToRoom,
  currentUser,
} from "../actions/registration";

export function handleMessage(ws: WebSocket, data: DataType) {
  switch (data.type) {
    case "reg":
      registration(
        ws, // Use ws directly
        data.data as NewUser
      );
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
    // case 'start_game':
    //   handleStartGame(ws, data);
    //   break;
    // case 'attack':
    //   handleAttack(ws, data);
    //   break;
    case "update_room":
      updateRoom();
      break;

    default:
      sendError(ws, "Unknown message type");
  }
}
