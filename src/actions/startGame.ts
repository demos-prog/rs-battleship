import { StartGameDto } from "../dto/StartGame.dto";
import { ShipsOfPlayer } from "../dto/ShipsOfPlayer.dto";
import { games, players } from "../gameData";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { turn } from "./turn";
import { ShipType } from "../entities/Ship.type";

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
      data: JSON.stringify(shipsOfPlayer),
      id: 0,
    };
    players.get(player.indexPlayer).ws.send(JSON.stringify(response));
    console.log("Start game");
    turn(gameId);
  });

  const freshGame: GameType = games.get(gameId);

  freshGame.players.forEach((player: PlayerType) => {
    let field = [
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ];

    player.ships.forEach((ship: ShipType) => {
      for (let i = 0; i < ship.length; i++) {
        if (ship.direction) {
          if (ship.position.y + i < 10) {
            field[ship.position.y + i][ship.position.x] = "o";
          } else {
            console.log("y -", ship.position.y);
            console.error("Ship exceeds field boundaries vertically.");
          }
        } else {
          if (ship.position.x + i < 10) {
            field[ship.position.y][ship.position.x + i] = "o";
          } else {
            console.log("x -", ship.position.x);
            console.error("Ship exceeds field boundaries horizontally.");
          }
        }
      }
    });
    console.log("FIELD");
    field.forEach((row) => {
      console.log(row.join(" "));
    });
  });
}
