export type DataType = {
  type:
    | 'reg'
    | 'update_winners'
    | 'create_room'
    | 'add_user_to_room'
    | 'create_game'
    | 'update_room'
    | 'add_ships'
    | 'start_game'
    | 'attack'
    | 'randomAttack'
    | 'turn'
    | 'finish';
  data: Object;
  id: 0;
};
