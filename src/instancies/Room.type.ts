export interface RoomType {
  roomId: number | string;
  roomUsers: {
    name: string;
    index: number | string;
  }[];
}
