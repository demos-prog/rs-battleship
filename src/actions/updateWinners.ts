import { wss } from "../..";
import { ScoreTableItem } from "../entities/ScoreTableItem.type";
import { scoreTable } from "../gameData";

export function updateWinnners() {
  const array: ScoreTableItem[] = Array.from(scoreTable.values());

  const response = JSON.stringify({
    type: "update_winners",
    data: JSON.stringify(array.sort((a, b) => a.wins - b.wins)),
    id: 0,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
  console.log("Update winners");
}
