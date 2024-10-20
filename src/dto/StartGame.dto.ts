import { ShipsOfPlayer } from "./ShipsOfPlayer.dto";

export interface StartGameDto {
  type: "start_game";
  data: ShipsOfPlayer | string;
  id: number;
}
