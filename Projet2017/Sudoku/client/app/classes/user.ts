export class User {
    static username: string;
    static difficulty: string;
    static time: number;
    static socket: SocketIOClient.Socket;

    static delete() {
        User.username = null;
        User.difficulty = null;
        User.time = null;
        User.socket.disconnect();
    }
}
