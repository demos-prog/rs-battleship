import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoomType } from "../entities/Room.type";
import { players, rooms } from "../gameData";
import { getUsersData } from "./getUsersData";
import { PlayerDataType } from "../entities/PlayerData.type";
import { addUserToRoom } from "./addUserToRoom";
import { AddUserToRoomDto } from "../dto/AddUserToRoom.dto";
import { handleMessage } from "../handlers/messageHandler";
import { sendError } from "./sendError";

export function singlePlay(ws: WebSocket) {
  const user: PlayerDataType | undefined = getUsersData(ws);

  if (!user) {
    return;
  }

  const botId = uuidv4();
  const botWs = new WebSocket("ws://localhost:3000/");

  botWs.onopen = () => {
    const botPlayer: PlayerDataType = {
      ws: botWs,
      name: "Bot-" + botId,
      password: botId,
      index: botId,
    };

    players.set(botId, botPlayer);

    const newRoom: RoomType = {
      roomId: uuidv4(),
      roomUsers: [
        {
          name: botPlayer.name,
          index: botId,
        },
      ],
    };
    rooms.set(newRoom.roomId, newRoom);
    console.log("Create room");

    const addUserToRoomDto: AddUserToRoomDto = {
      type: "add_user_to_room",
      data: {
        indexRoom: newRoom.roomId,
      },
      id: 0,
    };

    addUserToRoom(ws, addUserToRoomDto);
    let lastProcessedId: number | null = null;

    botWs.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        console.log("Message from server:", message);

        if (message.type === "update_room" && message.id !== lastProcessedId) {
          lastProcessedId = message.id;
          console.log("Command from client: ", message.type);
          console.log("Update room");
          handleMessage(ws, message);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        sendError(ws, "Invalid message format");
      }
    };
  };
}
