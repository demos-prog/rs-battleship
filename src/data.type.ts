export interface DataType {
  type:
    | 'reg' // done
    | 'update_winners'
    | 'create_room'
    | 'add_user_to_room'
    | 'create_game'
    | 'update_room' // done
    | 'add_ships'
    | 'start_game'
    | 'attack'
    | 'randomAttack'
    | 'turn'
    | 'finish';
  data: object | string;
  id: 0;
}
