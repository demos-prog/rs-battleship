import { ShipType } from "../entities/Ship.type";

export interface GameDto {
  gameId: number | string;
  ships: ShipType[];
  indexPlayer: number | string;
}
