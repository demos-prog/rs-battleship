import { WebSocketServer, WebSocket } from 'ws';
// import { httpServer } from './src/http_server/index.js';
import { v4 as uuidv4 } from 'uuid';
import { DataType } from './src/instancies/Data.type';
import { NewUser } from './src/dto/NewUser.dto';
import { CreatedUser } from './src/dto/CreatedUser.dto';

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { RoomType } from './src/instancies/Room.type';
import { ScoreTableItem } from './src/instancies/ScoreTableItem.type';

const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
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
  name: '',
  index: '',
  error: false,
  errorText: '',
};

wss.on('connection', (ws: WebSocket) => {
  console.log('New connection');

  ws.addEventListener('message', (event) => {
    try {
      const parsedData: DataType = JSON.parse(event.data as string);
      handleMessage(ws, parsedData);
    } catch (error) {
      console.error('Error parsing message:', error);
      sendError(ws, 'Invalid message format');
    }
  });

  ws.addEventListener('close', () => {
    // Handle player disconnection
    // Remove player from rooms, games, etc.
  });
});

function handleMessage(ws: WebSocket, data: DataType) {
  switch (data.type) {
    case 'reg':
      handleRegistration(ws, data.data as NewUser);
      break;
    case 'create_room':
      createRoom(ws, currentUser);
      break;
    case 'update_winners':
      updateWinnners(ws);
      break;
    // case 'create_game':
    //   handleCreateGame(ws, data);
    //   break;
    // case 'start_game':
    //   handleStartGame(ws, data);
    //   break;
    // case 'attack':
    //   handleAttack(ws, data);
    //   break;
    case 'update_room':
      updateRoom(ws);
      break;

    default:
      sendError(ws, 'Unknown message type');
  }
}

function handleRegistration(ws: WebSocket, data: NewUser) {
  let usersData: NewUser;
  if (typeof data === 'string') {
    try {
      usersData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing NewUser data:', error);
      sendError(ws, 'Invalid NewUser data format');
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
    errorText: 'No errors',
  };

  currentUser = createdUser;
  sendPersonalResponse(ws, 'reg', createdUser);
  updateRoom(ws);
  updateWinnners(ws);
}

// creates game room and add yourself there
function createRoom(ws: WebSocket, user: CreatedUser) {
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
  updateRoom(ws);
}

function updateWinnners(ws: WebSocket) {
  const response = JSON.stringify({
    type: 'update_winners',
    data: JSON.stringify(scoreTable.sort((a, b) => b.wins - a.wins)),
    id: 0,
  });
  ws.send(response);
}

// function handleCreateGame(ws: WebSocket, data: DataType) {
//   const gameId = uuidv4();
//   const playerId = data.playerId;
//   const game = { id: gameId, players: [playerId], state: 'waiting' };
//   games.set(gameId, game);
//   rooms.set(gameId, { id: gameId, players: [players.get(playerId).name] });
//   sendPersonalResponse(ws, 'create_game', { gameId, playerId });
//   broadcastRoomUpdate();
// }

// function handleStartGame(ws: WebSocket, data: DataType) {
//   const game = games.get(data.gameId);
//   if (game && game.players.includes(data.playerId)) {
//     game.state = 'playing';
//     // Generate ship positions and other game setup logic here
//     const shipPositions = generateShipPositions();
//     sendGameResponse(ws, 'start_game', {
//       gameInfo: {
//         /* game information */
//       },
//       ships: shipPositions,
//     });
//     sendGameResponse(ws, 'turn', { playerId: game.players[0] });
//   } else {
//     sendError(ws, 'Invalid game or player');
//   }
// }

// function handleAttack(ws: WebSocket, data: DataType) {
//   const game = games.get(data.gameId);
//   if (game && game.state === 'playing') {
//     // Implement attack logic here
//     const attackResult = performAttack(game, data.playerId, data.coordinates);
//     sendGameResponse(ws, 'attack', attackResult);
//     if (isGameFinished(game)) {
//       const winner = determineWinner(game);
//       sendGameResponse(ws, 'finish', { winnerId: winner });
//       updateWinners(winner);
//       games.delete(data.gameId);
//       rooms.delete(data.gameId);
//       broadcastRoomUpdate();
//       broadcastWinnersUpdate();
//     } else {
//       const nextPlayer = getNextPlayer(game);
//       sendGameResponse(ws, 'turn', { playerId: nextPlayer });
//     }
//   } else {
//     sendError(ws, 'Invalid game or game state');
//   }
// }

function sendPersonalResponse(ws: WebSocket, type: string, data: CreatedUser) {
  const response = JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
  ws.send(response);
}

// function sendGameResponse(ws: WebSocket, type, data) {
//   ws.send(JSON.stringify({ type: 'game', responseType: type, ...data }));
// }

// sends rooms list, where only one player inside
function updateRoom(ws: WebSocket) {
  const roomData = Array.from(rooms.values());
  const response = JSON.stringify({
    type: 'update_room',
    data: JSON.stringify(roomData),
    id: 0,
  });
  ws.send(response);
}

// function sendWinnersUpdate(ws: WebSocket) {
//   // Implement logic to get and send the score table
//   const scoreTable = getScoreTable();
//   ws.send(JSON.stringify({ type: 'update_winners', scoreTable }));
// }

// function broadcastRoomUpdate() {
//   const roomData = Array.from(rooms.values());
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ type: 'update_room', rooms: roomData }));
//     }
//   });
// }

// function broadcastWinnersUpdate() {
//   const scoreTable = getScoreTable();
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ type: 'update_winners', scoreTable }));
//     }
//   });
// }

function sendError(ws: WebSocket, message: String) {
  ws.send(JSON.stringify({ type: 'error', message }));
}

// function generateShipPositions() {}
// function performAttack(game, playerId, coordinates) {}
// function isGameFinished(game) {}
// function determineWinner(game) {}
// function getNextPlayer(game) {}
// function getScoreTable() {}
// function updateWinners(winner) {}

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});
