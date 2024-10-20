import { v4 as uuidv4 } from "uuid";
import { CreatedUser } from "../dto/CreatedUser.dto";
import { RoomType } from "../entities/Room.type";
import { updateRoom } from "./updateRoom";
import { rooms } from "../gameData";

export function createRoom(user: CreatedUser) {
  const newRoom: RoomType = {
    roomId: uuidv4(),
    roomUsers: [
      {
        name: user.name,
        index: user.index,
      },
    ],
  };

  rooms.set(newRoom.roomId, newRoom);
  updateRoom();
}
