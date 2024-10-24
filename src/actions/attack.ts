import { AttackResponseDto } from "../dto/AttackResponse.dto";
import { PlayerAttackDto } from "../dto/PlayerAttack.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { fieldsData, games, players, turns } from "../gameData";
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

  const currentAttackerIndex = data.indexPlayer;
  const game: GameType = games.get(data.gameId);

  const victimPalyer: PlayerType | undefined = game.players.find(
    (player: PlayerType) => {
      return player.indexPlayer !== currentAttackerIndex;
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

      // preventing click spaming
      const prevAttackerIndex = turns.get(data.gameId);

      if (status === "shot" || status === "killed") {
        if (prevAttackerIndex === currentAttackerIndex) {
          return;
        }
      } else {
        if (prevAttackerIndex === currentAttackerIndex) {
          return;
        }
        turns.set(data.gameId, currentAttackerIndex);
      }

      fieldData.players[i].field = victimField;
      fieldsData.set(data.gameId, fieldData);

      const res: AttackResponseDto = {
        type: "attack",
        data: JSON.stringify({
          position: {
            x: data.x,
            y: data.y,
          },
          currentPlayer: currentAttackerIndex,
          status,
        }),
        id: 0,
      };

      game.players.forEach((player: PlayerType) => {
        players.get(player.indexPlayer).ws.send(JSON.stringify(res));
      });
      const nextPlayerIndex =
        status === "miss" ? victimPalyer.indexPlayer : currentAttackerIndex;

      turn(data.gameId, nextPlayerIndex);
      checkFinish(data.gameId);
    }
  } else {
    console.log("victimField is undefined");
  }
}
