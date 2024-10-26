export interface RandomAttackDto {
  type: "randomAttack";
  data: {
    gameId: number | string;
    indexPlayer:
      | number
      | string /* id of the player in the current game session */;
  };
  id: 0;
}
