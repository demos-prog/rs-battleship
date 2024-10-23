export interface AttackResponseDto {
  type: "attack";
  data:
    | string
    | {
        position: {
          x: number;
          y: number;
        };
        currentPlayer: number | string;
        status: "miss" | "killed" | "shot";
      };
  id: 0;
}
