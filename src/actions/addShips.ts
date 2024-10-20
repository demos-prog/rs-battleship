import { GameDto } from "../dto/Game.dto";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { games } from "../gameData";

export function addShips(gameData: GameDto) {
  if (typeof gameData === "string") {
    gameData = JSON.parse(gameData);
  }

  const game: GameType = games.get(gameData.gameId);

  if (game) {
    const player: PlayerType | undefined = game.players.find(
      (player: PlayerType) => player.indexPlayer === gameData.indexPlayer
    );

    if (player) {
      player.ships = gameData.ships;
      game.players[game.players.indexOf(player)] = player;
      games.set(gameData.gameId, game);
    } else {
      console.error("Player not found");
    }
  } else {
    console.error("Game not found");
  }
}
