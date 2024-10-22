import { PlayerAttackDto } from "../dto/PlayerAttack.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { GameType } from "../entities/Game.type";
import { PlayerType } from "../entities/Player.type";
import { fieldsData, games } from "../gameData";

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

  let fieldData: FieldsDataType = fieldsData.get(data.gameId);

  let victimField = fieldData.players.find((player) => {
    return player.indexPlayer === victimPalyer?.indexPlayer;
  })?.field;

  victimField?.forEach((row) => {
    console.log(row.join(" "));
  });

  if (victimField) {
    const target = victimField[data.y][data.x];
    console.log(target);
  } else {
    console.log("victimField is undefined");
  }
}
