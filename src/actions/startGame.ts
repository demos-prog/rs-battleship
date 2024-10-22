import { StartGameDto } from "../dto/StartGame.dto";
import { ShipsOfPlayer } from "../dto/ShipsOfPlayer.dto";
import { games, players, fieldsData } from "../gameData";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { turn } from "./turn";
import { ShipType } from "../entities/Ship.type";
import { FieldsDataType } from "../entities/FieldsData.type";

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
    let field: string[][] = [
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
      ["___", "___", "___", "___", "___", "___", "___", "___", "___", "___"],
    ];

    let oneLengthShipsCounter = 1;
    let twoLengthShipsCounter = 1;
    let threeLengthShipsCounter = 1;
    let fourLengthShipsCounter = 1;

    function getShipCounter(shipLength: number) {
      switch (shipLength) {
        case 1:
          return oneLengthShipsCounter++;
        case 2:
          return twoLengthShipsCounter++;
        case 3:
          return threeLengthShipsCounter++;
        case 4:
          return fourLengthShipsCounter++;
        default:
          break;
      }
    }

    player.ships.forEach((ship: ShipType) => {
      const counter = getShipCounter(ship.length);
      for (let i = 0; i < ship.length; i++) {
        if (ship.direction) {
          if (ship.position.y + i < 10) {
            field[ship.position.y + i][
              ship.position.x
            ] = `S${ship.length}${counter}`;
          } else {
            console.log("y -", ship.position.y);
            console.error("Ship exceeds field boundaries vertically.");
          }
        } else {
          if (ship.position.x + i < 10) {
            field[ship.position.y][
              ship.position.x + i
            ] = `S${ship.length}${counter}`;
          } else {
            console.log("x -", ship.position.x);
            console.error("Ship exceeds field boundaries horizontally.");
          }
        }
      }
    });

    const data: FieldsDataType = {
      firstPlayer: {
        indexPlayer: game.players[0].indexPlayer,
        field,
      },
      secondPlayer: {
        indexPlayer: game.players[0].indexPlayer,
        field,
      },
    };

    fieldsData.set(gameId, data);
    const dt: FieldsDataType = fieldsData.get(gameId);
    console.log("FIELD of the firstPlayer: ");
    dt.firstPlayer.field.forEach((row) => {
      console.log(row.join(" "));
    });
    console.log("FIELD of the secondPlayer:");
    dt.secondPlayer.field.forEach((row) => {
      console.log(row.join(" "));
    });
  });
}
