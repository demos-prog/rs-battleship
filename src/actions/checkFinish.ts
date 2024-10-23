import { FinishDto } from "../dto/Finish.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { fieldsData, players } from "../gameData";

export function checkFinish(gameId: string | number) {
  const field: FieldsDataType = fieldsData.get(gameId);
  let finish = true;
  let flag = 0;

  field.players.forEach((player, i) => {
    flag = i;
    for (let i = 0; i < player.field.length; i++) {
      const row: string[] = player.field[i];
      if (row.some((cell) => cell.startsWith("S"))) {
        finish = false;
        break;
      }
    }
  });

  if (finish) {
    const res: FinishDto = {
      type: "finish",
      data: JSON.stringify({
        winPlayer: field.players[flag === 0 ? 1 : 0].indexPlayer,
      }),
      id: 0,
    };

    field.players.forEach((player) => {
      players.get(player.indexPlayer).ws.send(JSON.stringify(res));
    });
  }
}
