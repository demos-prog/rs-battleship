import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { games, players } from "../gameData";

export function turn(gameId: string | number, nextPlayerId?: number | string) {
  const game: GameType | undefined = games.get(gameId);
  if (!game) {
    console.error("Game not found");
    return;
  }

  let playerTurnId: number | string = ""; // ID of the player who will play

  const randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber === 0) {
    playerTurnId = game.players[0].indexPlayer;
  } else {
    playerTurnId = game.players[1].indexPlayer;
  }

  const response = {
    type: "turn",
    data: JSON.stringify({
      currentPlayer: nextPlayerId ? nextPlayerId : playerTurnId,
    }),
    id: 0,
  };

  game.players.forEach((player: PlayerType) => {
    players.get(player.indexPlayer).ws.send(JSON.stringify(response));
  });
}
