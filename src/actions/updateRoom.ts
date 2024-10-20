import { wss } from "../..";
import { RoomType } from "../entities/Room.type";
import { rooms } from "../gameData";

// sends rooms list, where only one player inside
export function updateRoom() {
  const roomData = Array.from(rooms.values()).filter(
    (room: RoomType) => room.roomUsers.length === 1
  );
  const response = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(roomData),
    id: 0,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}
