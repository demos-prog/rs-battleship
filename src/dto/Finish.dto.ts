export interface FinishDto {
  type: "finish";
  data:
    | string
    | {
        winPlayer: number | string;
      };
  id: 0;
}
