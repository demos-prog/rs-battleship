export interface DataType {
  type:
    | "reg" // done
    | "update_winners" // done
    | "create_room" // done
    | "add_user_to_room" //done
    | "create_game" //done
    | "update_room" // done
    | "add_ships"
    | "start_game"
    | "attack"
    | "randomAttack"
    | "turn"
    | "finish";
  data: object | string;
  id: 0;
}
