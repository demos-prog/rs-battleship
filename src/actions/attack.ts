import { AttackResponseDto } from "../dto/AttackResponse.dto";
import { PlayerAttackDto } from "../dto/PlayerAttack.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { fieldsData, games, players } from "../gameData";
import { checkFinish } from "./checkFinish";
import { turn } from "./turn";

export function attack(attackData: PlayerAttackDto) {
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
      const targetCell = victimField[data.y][data.x];
      let status: "miss" | "killed" | "shot" = "miss";
      // Miss condition
      if (
        targetCell === "___" ||
        targetCell === "_X_" ||
        targetCell.startsWith("H")
      ) {
        victimField[data.y][data.x] = "_X_";
        status = "miss";
      } else {
        victimField[data.y][data.x] = `H${targetCell.slice(1)}`;
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
      fieldsData.set(data.gameId, fieldData);

      const res: AttackResponseDto = {
        type: "attack",
        data: JSON.stringify({
          position: {
            x: data.x,
            y: data.y,
          },
          currentPlayer: data.indexPlayer,
          status,
        }),
        id: 0,
      };

      game.players.forEach((player: PlayerType) => {
        players.get(player.indexPlayer).ws.send(JSON.stringify(res));
      });
      const nextPlayerIndex =
        status === "miss" ? victimPalyer.indexPlayer : data.indexPlayer;

      turn(data.gameId, nextPlayerIndex);
    }
  } else {
    console.log("victimField is undefined");
  }
}
