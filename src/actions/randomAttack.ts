import { AttackResponseDto } from "../dto/AttackResponse.dto";
import { RandomAttackDto } from "../dto/RandomAttack.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { fieldsData, games, players } from "../gameData";
import { checkFinish } from "./checkFinish";
import { turn } from "./turn";

export function randomAttack(attackData: RandomAttackDto) {
  if (typeof attackData === "string") {
    attackData = JSON.parse(attackData);
  }

  let data = attackData.data;

  if (typeof attackData.data === "string") {
    data = JSON.parse(attackData.data);
  }

  const game: GameType = games.get(data.gameId);

  const victimPalyer: PlayerType | undefined = game.players.find(
    (player: PlayerType) => {
      return player.indexPlayer !== data.indexPlayer;
    }
  );

  if (victimPalyer) {
    let fieldData: FieldsDataType = fieldsData.get(data.gameId);

    let i = 0;
    let victimField: string[][] | undefined = fieldData.players.find(
      (player, ind) => {
        i = ind;
        return player.indexPlayer === victimPalyer?.indexPlayer;
      }
    )?.field;

    if (victimField) {
      // random attack
      let newData = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        indexPlayer: data.indexPlayer,
        gameId: data.gameId,
      };
      let targetCell = "";
      do {
        (newData.x = Math.floor(Math.random() * 10)),
          (newData.y = Math.floor(Math.random() * 10)),
          (targetCell = victimField[newData.y][newData.x]);
      } while (targetCell === "_X_" || targetCell.startsWith("H"));

      let status: "miss" | "killed" | "shot" = "miss";
      // Miss condition
      if (targetCell === "___") {
        victimField[newData.y][newData.x] = "_X_";
        status = "miss";
      } else {
        victimField[newData.y][newData.x] = `H${victimField[newData.y][
          newData.x
        ].slice(1)}`;
        status = "killed";
        for (let i = 0; i < victimField.length; i++) {
          const row = victimField[i];
          if (row.includes(targetCell)) {
            status = "shot";
            break;
          }
        }
      }

      checkFinish(data.gameId);
      // can be removed
      victimField.forEach((row) => {
        console.log(row.join(" "));
      });

      fieldData.players[i].field = victimField;
      fieldsData.set(newData.gameId, fieldData);

      const res: AttackResponseDto = {
        type: "attack",
        data: JSON.stringify({
          position: {
            x: newData.x,
            y: newData.y,
          },
          currentPlayer: newData.indexPlayer,
          status,
        }),
        id: 0,
      };

      game.players.forEach((player: PlayerType) => {
        players.get(player.indexPlayer).ws.send(JSON.stringify(res));
      });
      const nextPlayerIndex =
        status === "miss" ? victimPalyer.indexPlayer : newData.indexPlayer;

      turn(newData.gameId, nextPlayerIndex);
    }
  } else {
    console.log("victimField is undefined");
  }
}
