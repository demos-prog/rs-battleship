export interface DataType {
  type:
    | "reg"
    | "update_winners"
    | "create_room"
    | "add_user_to_room"
    | "create_game"
    | "update_room"
    | "add_ships"
    | "start_game"
    | "attack"
    | "randomAttack"
    | "turn"
    | "finish"
    | "single_play";
  data: object | string;
  id: 0;
}
