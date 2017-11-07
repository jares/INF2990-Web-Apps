/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from './app';
import * as http from 'http';
import * as SocketIO from 'socket.io';
import UserCurling from './userCurling.model';

let players: { [id: string]: any; } = {};

const application: Application = Application.bootstrap();

// Configuration du port d'écoute
const appPort = normalizePort(process.env.PORT || '3002');
application.app.set('port', appPort);

// Création du serveur HTTP.
let server = http.createServer(application.app);
let io = SocketIO(server);
/**
 *  Écoute du traffic sur le port configuré.
 */
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);



io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('new_player', (username: string) => {
    console.log('adding new player', username);
    players[socket.id] = { username: username };
  });

  socket.on('disconnect', () => {
    if (players[socket.id] && players[socket.id].username) {

      let username = players[socket.id].username;
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
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d'écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val: number | string): number | string | boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;

  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }

}

/**
 * Se produit lorsque le serveur détecte une erreur.
 *
 * @param error Erreur interceptée par le serveur.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

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
  UserCurling.remove({ name: username }).exec();
}
