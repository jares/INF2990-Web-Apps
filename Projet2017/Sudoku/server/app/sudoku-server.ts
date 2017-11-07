import * as SocketIO from 'socket.io';
import { SudokuContainer } from './sudokuContainer';
import * as http from 'http';
import UserSudoku from './user.model';
import Score from './score.model';




export class SudokuServer {
    io: SocketIO.Server;
    container: SudokuContainer;
    players: { [id: string]: string; } = {};
    waitingQueue: { socket: SocketIO.Socket, difficulty: string }[];

    constructor(server: http.Server) {

        UserSudoku.remove({}, function () {
            console.log('Erased previous users still in the collection');
        });

        this.io = SocketIO(server);
        this.container = new SudokuContainer();
        this.container.init();
        this.waitingQueue = [];
        this.init();
    }

    init() {
        let self = this;

        this.io.sockets.on('connection', function (socket) {

            socket.on('new_player', function (username: string) {
                console.log(username + ' connected');
                self.players[socket.id] = username;
            });

            socket.on('disconnect', function () {
                console.log(self.players[socket.id], "disconnected");
                self.removeFromCollection(self.players[socket.id]);
                delete self.players[socket.id];
            });

            socket.on('sudoku_request', function (diff: string) {
                console.log("Received sudoku request from", self.players[socket.id]);
                self.io.emit('event', { date: Date.now(), type: "Demande", desc: socket.handshake.address });
                let request = { socket: socket, difficulty: diff };
                self.sendSudoku(request);
            });

            socket.on('new_score', function (score: any) {
                console.log("Received new score:", score);
                self.getScores(socket, score);
                self.addScore(score);
            });

        });
    }

    addScore(newScore: { name: string, difficulty: string, sec: number, time: number }) {
        let score = new Score(newScore);
        score.save();
    }

    getScores(socket: SocketIO.Socket, newScore: any) {
        let lbEasy: any[] = [];
        let lbHard: any[] = [];

        Score.find({ difficulty: 'facile' }).sort({ sec: 1 }).exec(function (err, docs) {
            lbEasy = docs.splice(0, 3);
            console.log("Best scores for easy sudokus were:", lbEasy);
        }).then(() => {

            Score.find({ difficulty: 'difficile' }).sort({ sec: 1 }).exec(function (err, docs) {
                lbHard = docs.splice(0, 3);
                console.log("Best scores for hard sudokus were:", lbHard);
            }).then(() => {

                if (newScore.difficulty === "facile") {
                    lbEasy = this.updateScores(lbEasy, newScore, false, socket);
                }
                else {
                    lbHard = this.updateScores(lbHard, newScore, true, socket);
                }

                if (lbEasy && lbHard) {
                    let bestScores = { lbEasy: lbEasy, lbHard: lbHard };
                    this.sendScores(socket, bestScores);
                    return;
                }
                console.log("The new score did not break the fastest time")
            });
        });
    }

    updateScores(lb: any[], newScore: any, isHard: boolean, socket: SocketIO.Socket): any[] {
        //Si le nouveau temps est plus bas que le record précédent,
        //il est ajouté en première place
        if (lb[0].sec > newScore.sec) {
            lb.unshift(newScore);
            lb.pop();
            socket.emit('fastest_time');
            return lb;
        }
        //Si il y a égalité pour la première place, on ajoute le nouveau temps en dessous
        else if (lb[0].sec === newScore.sec) {
            let i = 0;
            while (lb[i++].sec === newScore.sec) { }
            lb.splice(--i, 0, newScore);
            socket.emit('fastest_time');
            return lb;
        }
        //Pas besoin d'envoyer les leaderboards pour les autres cas
        return null;
    }

    sendScores(socket: SocketIO.Socket, bestScores: { lbEasy: any[], lbHard: any[] }) {
        socket.emit('leaderboards_sent', bestScores)
    }

    sendSudoku(request: { socket: SocketIO.Socket, difficulty: string }) {
        let sudoku = this.container.pop(request.difficulty);

        if (sudoku === null) {
            console.log(this.players[request.socket.id], "is waiting for a sudoku");
            this.waitingQueue.push(request);
        }
        else {
            let self = this;
            request.socket.emit("sudoku_sent", sudoku);
            console.log(request.difficulty, "sudoku sent to", this.players[request.socket.id]);
            setTimeout(function () {
                self.container.addSudoku(request.difficulty);
                self.io.emit('event', { date: Date.now(), type: "Génération", desc: request.difficulty });
                self.checkQueue();
            }, 5000);
        }
    }

    checkQueue() {
        if (this.waitingQueue.length !== 0) {
            let request = this.waitingQueue.shift();
            this.sendSudoku(request);
        }
    }

    removeFromCollection(username: string) {
        UserSudoku.remove({ name: username }).exec();
    }

}