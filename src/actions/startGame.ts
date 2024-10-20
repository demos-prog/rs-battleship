import { StartGameDto } from "../dto/StartGame.dto";
import { ShipsOfPlayer } from "../dto/ShipsOfPlayer.dto";
import { games, players } from "../gameData";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";

export function startGame(gameId: string | number) {
  const game: GameType | undefined = games.get(gameId);
  if (!game) {
    console.error("Game not found");
    return;
  }
  game.players.forEach((player: PlayerType) => {
    const shipsOfPlayer: ShipsOfPlayer = {
      ships: player.ships,
      currentPlayerIndex: player.indexPlayer,
    };

    const response: StartGameDto = {
      type: "start_game",
      data: shipsOfPlayer,
      id: 0,
    };
    const playerWs = players.get(player.indexPlayer).ws;
    playerWs.send(JSON.stringify(response));
  });
}
