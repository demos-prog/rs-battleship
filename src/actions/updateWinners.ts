import { wss } from "../..";
import { scoreTable } from "../gameData";

export function updateWinnners() {
  const response = JSON.stringify({
    type: "update_winners",
    data: JSON.stringify(scoreTable.sort((a, b) => b.wins - a.wins)),
    id: 0,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
  console.log("update_winners");
}
