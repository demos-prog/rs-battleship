import { GameDto } from "../dto/Game.dto";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { games } from "../gameData";
import { startGame } from "./startGame";

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
      console.log('Add ships');

      const isValiddGame = games
        .get(gameData.gameId)
        .players.every((player: PlayerType) => player.ships.length === 10);
      if (isValiddGame) {
        startGame(gameData.gameId);
      }
    } else {
      console.error("Player not found");
    }
  } else {
    console.error("Game not found");
  }
}
