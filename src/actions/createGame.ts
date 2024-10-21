import { GameType } from "../entities/Game.type";
import { RoomType } from "../entities/Room.type";
import { games, players, rooms } from "../gameData";

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
  console.log('Create game');
}
