import { PlayerAttackDto } from "../dto/PlayerAttack.dto";
import { GameType } from "../entities/Game.type";
import { games } from "../gameData";

export function attack(attackData: PlayerAttackDto) {
  if (typeof attackData === "string") {
    attackData = JSON.parse(attackData);
  }
  
  let data = attackData.data;

  if (typeof attackData.data === "string") {
    data = JSON.parse(attackData.data);
  }

  console.log('data -',data);

  const game: GameType = games.get(data.gameId);
  console.log('game -', game);
}
