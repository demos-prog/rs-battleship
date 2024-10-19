import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { RoomType } from "./src/entities/Room.type";
import { DataType } from "./src/entities/Data.type";
import { ScoreTableItem } from "./src/entities/ScoreTableItem.type";
import { NewUser } from "./src/dto/NewUser.dto";
import { CreatedUser } from "./src/dto/CreatedUser.dto";
import { GameDto } from "./src/dto/Game.dto";
import { GameType } from "./src/entities/Game.type";
import { PlayerType } from "./src/entities/Player.type";

const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const HTTP_PORT = 3000;

const wss = new WebSocketServer({ server: httpServer });

const games = new Map();
const players = new Map();
const rooms = new Map();
const scoreTable: ScoreTableItem[] = [];

let currentUser: CreatedUser = {
  name: "",
  index: "",
  error: false,
  errorText: "",
};

wss.on("connection", (ws: WebSocket) => {
  console.log("New connection");

  ws.addEventListener("message", (event) => {
    try {
      const parsedData: DataType = JSON.parse(event.data as string);
      handleMessage(ws, parsedData);
    } catch (error) {
      console.error("Error parsing message:", error);
      sendError(ws, "Invalid message format");
    }
  });

  ws.addEventListener("close", () => {
    // Handle player disconnection
    // Remove player from rooms, games, etc.
  });
});

function handleMessage(ws: WebSocket, data: DataType) {
  switch (data.type) {
    case "reg":
      handleRegistration(ws, data.data as NewUser);
      break;
    case "create_room":
      createRoom(currentUser);
      break;
    case "update_winners":
      updateWinnners();
      break;
    case "add_user_to_room":
      addUserToRoom(ws, data.data as { indexRoom: number | string });
      break;
    case "add_ships":
      addShips(data.data as GameDto);
      break;
    // case 'start_game':
    //   handleStartGame(ws, data);
    //   break;
    // case 'attack':
    //   handleAttack(ws, data);
    //   break;
    case "update_room":
      updateRoom();
      break;

    default:
      sendError(ws, "Unknown message type");
  }
}

function handleRegistration(ws: WebSocket, data: NewUser) {
  let usersData: NewUser;
  if (typeof data === "string") {
    try {
      usersData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing NewUser data:", error);
      sendError(ws, "Invalid NewUser data format");
      return;
    }
  } else {
    usersData = data;
  }

  const playerId = uuidv4();
  players.set(playerId, { ws, name: usersData.name });

  const createdUser: CreatedUser = {
    name: usersData.name,
    index: playerId,
    error: false,
    errorText: "No errors",
  };

  currentUser = createdUser;
  sendPersonalResponse(ws, "reg", createdUser);
  updateRoom();
  updateWinnners();
}

function createRoom(user: CreatedUser) {
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

function updateWinnners() {
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

// add youself to somebodys room, then remove the room from available rooms list
function addUserToRoom(ws: WebSocket, data: { indexRoom: number | string }) {
  let index: string;
  if (typeof data === "string") {
    index = JSON.parse(data).indexRoom;
  } else if (typeof data.indexRoom === "string") {
    index = data.indexRoom;
  } else {
    console.error("Invalid indexRoom type");
    return;
  }

  const room = rooms.get(index);
  if (!room) {
    console.error("Room not found");
    return;
  }

  if (room.roomUsers[0].index === currentUser.index) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: "You are already in this room",
        id: 0,
      })
    );
    console.log("You are already in this room");
    return;
  }

  room.roomUsers.push({
    name: currentUser.name,
    index: currentUser.index,
  });

  rooms.set(index, room);
  updateRoom();
  createGame(index);
}

//sends for both players in the room, after they are connected to the room
function createGame(idGame: number | string) {
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

function addShips(gameData: GameDto) {
  if (typeof gameData === "string") {
    gameData = JSON.parse(gameData);
  }
  console.log("indexPlayer from client", gameData.indexPlayer);

  const game: GameType = games.get(gameData.gameId);

  if (game) {
    const player: PlayerType | undefined = game.players.find(
      (player: PlayerType) => player.indexPlayer === gameData.indexPlayer
    );

    if (player) {
      player.ships = gameData.ships;
      game.players[game.players.indexOf(player)] = player;
      games.set(gameData.gameId, game);

      games.get(gameData.gameId).players.forEach((player: PlayerType) => {
        console.log(player);
      });
    } else {
      console.error("Player not found");
    }
  } else {
    console.error("Game not found");
  }
}

function sendPersonalResponse(ws: WebSocket, type: string, data: CreatedUser) {
  const response = JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
  ws.send(response);
}

// sends rooms list, where only one player inside
function updateRoom() {
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

function sendError(ws: WebSocket, message: String) {
  ws.send(JSON.stringify({ type: "error", message }));
}

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});
