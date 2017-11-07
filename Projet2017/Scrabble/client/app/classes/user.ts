import { Page } from './page';

export class User {
    static username: string;
    static gameSize: number;
    static socket: SocketIOClient.Socket;
    static page: Page;

    static delete() {
        User.username = null;
        User.gameSize = null;
        User.socket = null;
        User.page = null;
    }
}
