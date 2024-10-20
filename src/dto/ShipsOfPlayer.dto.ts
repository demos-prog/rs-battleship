import { ShipType } from "../entities/Ship.type";

export interface ShipsOfPlayer {
  ships: ShipType[] /* player's ships, not enemy's */;
  currentPlayerIndex: number | string;
}
