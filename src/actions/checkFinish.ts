import { FinishDto } from "../dto/Finish.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { fieldsData, players } from "../gameData";

export function checkFinish(gameId: string | number) {
  const field: FieldsDataType = fieldsData.get(gameId);

  const firstIsAlive = field.players[0].field.some((row) =>
    row.some((cell) => cell.startsWith("S"))
  );
  const secondIsAlive = field.players[1].field.some((row) =>
    row.some((cell) => cell.startsWith("S"))
  );

  if (!firstIsAlive || !secondIsAlive) {
    const res: FinishDto = {
      type: "finish",
      data: JSON.stringify({
        winPlayer: firstIsAlive
          ? field.players[0].indexPlayer
          : field.players[1].indexPlayer,
      }),
      id: 0,
    };

    field.players.forEach((player) => {
      players.get(player.indexPlayer).ws.send(JSON.stringify(res));
    });
  }
}
