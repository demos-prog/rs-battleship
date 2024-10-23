import * as WebSocket from "ws";
import { getUsersData } from "./getUsersData";
import { PlayerDataType } from "../entities/PlayerData.type";
import { players, rooms } from "../gameData";
import { RoomUserType } from "../entities/RoomUser.type";
import { RoomType } from "../entities/Room.type";

export function handlePlayerdDisconnect(ws: WebSocket) {
  const user: PlayerDataType | undefined = getUsersData(ws);

  if (user) {
    const room: RoomType | undefined = Array.from(rooms.values()).find(
      (room: RoomType) =>
        room.roomUsers.find(
          (player: RoomUserType) => player.index === user.index
        )
    );

    if (room) {
      const currentRoomsUsers = room.roomUsers.filter(
        (roomUser) => roomUser.index !== user.index
      );
      if (currentRoomsUsers.length === 0) {
        rooms.delete(room.roomId);
      } else {
        room.roomUsers = currentRoomsUsers;
        rooms.set(room.roomId, room);
      }
    }

    players.delete(user.index);
  }
}
