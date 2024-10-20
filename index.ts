import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoomType } from "./src/entities/Room.type";
import { ScoreTableItem } from "./src/entities/ScoreTableItem.type";
import { CreatedUser } from "./src/dto/CreatedUser.dto";
import { GameDto } from "./src/dto/Game.dto";
import { GameType } from "./src/entities/Game.type";
import { PlayerType } from "./src/entities/Player.type";
import { httpServer } from "./src/httpServer";
import { wss } from "./src/wsServer";
import "dotenv/config";

const HTTP_PORT = process.env.HTTP_PORT;

const games = new Map();
export const players = new Map();
export const rooms = new Map();
const scoreTable: ScoreTableItem[] = [];

export function createRoom(user: CreatedUser) {
  const newRoom: RoomType = {
    roomId: uuidv4(),
    roomUsers: [
      {
        name: user.name,
        index: user.index,
      },
    ],
  };

  rooms.set(newRoom.roomId, newRoom);
  updateRoom();
}

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
}

//sends for both players in the room, after they are connected to the room
export function createGame(idGame: number | string) {
  let newGame: GameType = {
    gameId: idGame,
    players: [
      {
        ships: [],
        indexPlayer: "",
      },
      {
        ships: [],
        indexPlayer: "",
      },
    ],
  };

  const room: RoomType = rooms.get(idGame);
  room.roomUsers.forEach((user, i) => {
    const res = JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame,
        idPlayer: user.index,
      }),
      id: 0,
    });

    newGame.players[i].indexPlayer = user.index;
    players.get(user.index).ws.send(res);
  });
  games.set(idGame, newGame);
}

export function addShips(gameData: GameDto) {
  if (typeof gameData === "string") {
    gameData = JSON.parse(gameData);
  }

  const game: GameType = games.get(gameData.gameId);

  if (game) {
    const player: PlayerType | undefined = game.players.find(
      (player: PlayerType) => player.indexPlayer === gameData.indexPlayer
    );

    if (player) {
      player.ships = gameData.ships;
      game.players[game.players.indexOf(player)] = player;
      games.set(gameData.gameId, game);
    } else {
      console.error("Player not found");
    }
  } else {
    console.error("Game not found");
  }
}

export function sendPersonalResponse(
  ws: WebSocket,
  type: string,
  data: CreatedUser
) {
  const response = JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
  ws.send(response);
}

// sends rooms list, where only one player inside
export function updateRoom() {
  const roomData = Array.from(rooms.values()).filter(
    (room: RoomType) => room.roomUsers.length === 1
  );
  const response = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(roomData),
    id: 0,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});
