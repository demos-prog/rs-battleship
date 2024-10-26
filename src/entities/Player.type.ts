import { ShipType } from "./Ship.type";

export interface PlayerType {
  ships: ShipType[];
  indexPlayer: number | string;
}
