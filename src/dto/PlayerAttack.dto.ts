export interface PlayerAttackDto {
  type: "attack";
  data: {
    gameId: number | string;
    x: number;
    y: number;
    indexPlayer:
      | number
      | string;
  };
  id: 0;
}
