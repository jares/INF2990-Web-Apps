import * as SocketIO from 'socket.io';
import * as http from 'http';

export class Communicator {

    private static io: SocketIO.Server;

    static setSocket(server: http.Server) {
        Communicator.io = SocketIO(server);
    }

    static getIo() {
        if (Communicator.io) {
            return Communicator.io;
        }
        return null;
    }

    private constructor() { }


}
