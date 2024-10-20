import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { games, players } from "../gameData";

export function turn(gameId: string | number, nextPlayer?: number | string) {
  const game: GameType | undefined = games.get(gameId);
  if (!game) {
    console.error("Game not found");
    return;
  }

  let playerTurn: number | string = ""; // ID of the player who will play

  const randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber === 0) {
    playerTurn = game.players[0].indexPlayer;
  } else {
    playerTurn = game.players[1].indexPlayer;
  }

  const response = {
    type: "turn",
    data: JSON.stringify({
      currentPlayer: nextPlayer ? nextPlayer : playerTurn,
    }),
    id: 0,
  };

  game.players.forEach((player: PlayerType) => {
    players.get(player.indexPlayer).ws.send(JSON.stringify(response));
  });
}
