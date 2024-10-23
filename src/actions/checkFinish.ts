import { FinishDto } from "../dto/Finish.dto";
import { FieldsDataType } from "../entities/FieldsData.type";
import { ScoreTableItem } from "../entities/ScoreTableItem.type";
import { fieldsData, players, rooms, scoreTable } from "../gameData";
import { updateWinnners } from "./updateWinners";

export function checkFinish(gameId: string | number) {
  const field: FieldsDataType = fieldsData.get(gameId);

  const firstIsAlive = field.players[0].field.some((row) =>
    row.some((cell) => cell.startsWith("S"))
  );
  const secondIsAlive = field.players[1].field.some((row) =>
    row.some((cell) => cell.startsWith("S"))
  );

  if (!firstIsAlive || !secondIsAlive) {
    const winnerIndex = firstIsAlive
      ? field.players[0].indexPlayer
      : field.players[1].indexPlayer;

    const res: FinishDto = {
      type: "finish",
      data: JSON.stringify({
        winPlayer: winnerIndex,
      }),
      id: 0,
    };

    field.players.forEach((player) => {
      players.get(player.indexPlayer).ws.send(JSON.stringify(res));
    });

    const winnerName = players.get(winnerIndex).name;

    const winner: ScoreTableItem = scoreTable.get(winnerIndex);

    if (winner) {
      const updatedWinner: ScoreTableItem = {
        name: winnerName,
        wins: winner.wins + 1,
      };
      scoreTable.set(winnerIndex, updatedWinner);
    } else {
      const newdWinner: ScoreTableItem = {
        name: winnerName,
        wins: 1,
      };
      scoreTable.set(winnerIndex, newdWinner);
    }
    rooms.delete(gameId);
    updateWinnners();
  }
}
