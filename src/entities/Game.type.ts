import { PlayerType } from "./Player.type";

export interface GameType {
  gameId: number | string;
  players: [PlayerType, PlayerType];
}
