/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from './app';
import * as http from 'http';
import * as SocketIO from 'socket.io';
import UserScrabble from './userScrabble.model';
import { ScrabbleGame } from './scrabble-game';

let players: { [id: string] : any; } = {};
let games: ScrabbleGame[] = [];

const application: Application = Application.bootstrap();

// Configuration du port d'écoute
const appPort = normalizePort(process.env.PORT || '3002');
application.app.set('port', appPort);

// Création du serveur HTTP.
let server = http.createServer(application.app);
let io = SocketIO(server);

UserScrabble.remove({}, function(){
  console.log('Erased previous users still in the collection');
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('new_player', (username: string) => {
    console.log('adding new player', username);
    players[socket.id] = {username: username};
  });

  socket.on('find_game', (size: number) => {
    console.log('finding game of size', size);
    let index = findGame(size);
    if (index > -1) {
      console.log('game found of size', size, 'at index', index);
      games[index].addPlayer(players[socket.id], socket);
      players[socket.id].game = index;
    }
    else {
      console.log('no game found, creating a new game of size', size);
      games.push(new ScrabbleGame(size));
      games[games.length - 1].addPlayer(players[socket.id], socket);
      players[socket.id].game = games.length - 1;
    }
    console.log('Players:', players);
  });

  socket.on('disconnect', () => {
    if (players[socket.id] && players[socket.id].username) {
      let gameIndex = players[socket.id].game;
      let username = players[socket.id].username;

      games[gameIndex].removePlayer(username);
      if (games[gameIndex].players.length === 0) {
        games.splice(gameIndex, 1);
      }

      console.log(username, 'disconnected');
      removeFromCollection(players[socket.id].username);
      delete players[socket.id];
    }
    else {
      console.log('Unknown user disconnected');
    }
  });

});

/**
 *  Écoute du traffic sur le port configuré.
 */
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d'écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) { return val; }
  else if (port >= 0) { return port; }
  else { return false; }
}

/**
 * Se produit lorsque le serveur détecte une erreur.
 *
 * @param error Erreur interceptée par le serveur.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') { throw error; }
  let bind = (typeof appPort === 'string') ? 'Pipe ' + appPort : 'Port ' + appPort;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Se produit lorsque le serveur se met à écouter sur le port.
 */
function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

function removeFromCollection(username: string) {
  UserScrabble.remove({name: username}).exec();
}

function findGame(size: number): number {
  for (let i = 0; i < games.length; i++) {
    if (games[i].size === size && !games[i].full) {
      return i;
    }
  }
  return -1;
}
