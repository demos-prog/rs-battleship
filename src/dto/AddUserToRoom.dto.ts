export interface AddUserToRoomDto {
  type: "add_user_to_room";
  data: {
    indexRoom: number | string;
  };
  id: 0;
}
