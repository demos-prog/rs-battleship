import { RoomUserType } from "./RoomUser.type";

export interface RoomType {
  roomId: number | string;
  roomUsers: RoomUserType[];
}
