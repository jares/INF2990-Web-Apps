import { Player } from './player';
import { Board } from './board';
import { Tile } from './tile';
import { Reserve } from './reserve.service';
import { PointCounter } from './point-counter.service';
import { Dictionary } from './dictionary.service';
import * as SocketIO from 'socket.io';


const BOARD_SIZE = 15;
const RACK_MAX_SIZE = 7;
const TURN_TIME_LIMIT = 5 * 60 * 1000;
const DICTIONARY_TIME_LIMIT = 3 * 1000;
const BOARD_CENTER = 7;
const HELP = ['Toutes les commandes doivent être précédées de "!".',
    'placer <ligne><colonne>(h|v) <mot>',
    "Ligne et colonne spécifient l’emplacement du début du mot.",
    "h ou v détermine l'orientation du mot.",
    'Exemple : ',
    '• !placer g15v bonjour : joue le mot bonjour à la verticale et le b est positionné en g15.',
    "• !changer <lettre>...",
    "<lettre> indique la lettre à changer. Maximum de 7 lettres à la fois.",
    "Pour échanger une lettre blanche, elle doit être indiqué par l’étoile (*).",
    "• !passer",
    "Passer son tour.",
    "• !aide",
    "Affiche la liste des commandes.'\r'"];
const DIACRITICS_MAP = [
    { 'base': 'A', 'letters': '\u0041\u00C0\u00C1\u00C2\u00C3\u00C4\u00c5' }, // A, À, Á, Â, Ã, Ä, Å
    { 'base': 'C', 'letters': '\u00C7' }, // Ç
    { 'base': 'E', 'letters': '\u0045\u00C8\u00C9\u00CA\u00CB' }, // E, È, É, Ê, Ë
    { 'base': 'I', 'letters': '\u0049\u00CC\u00CD\u00CE\u00CF' }, // I, Ì, Í, Î, Ï
    { 'base': 'O', 'letters': '\u004F\u00D2\u00D3\u00D4\u00D5\u00D6' }, // O, Ò, Ó, Ô, Õ, Ö
    { 'base': 'U', 'letters': '\u0055\u00D9\u00DA\u00DB\u00DC' }, // U, Ù, Ú, Û, Ü
];

export class ScrabbleGame {

    players: Player[] = [];             //Tableau de joueur
    board: Board;                       //Plateau de jeu contenant les lettres jouées
    pointCounter = new PointCounter();  //Compteur de points donnés par un mot joué
    reserve: Reserve;                   //Réserve de lettres
    size: number;                       //Grandeur de la partie (2, 3 ou 4)
    full: boolean;                      //Booléen indiquant si la partie est pleine
    isFirstTurn = true;                 //Booléen indiquant si le tour en cours est le premier

    activePlayerIndex: number;              //Indice du joueur dont c'est le tour
    turnPromise: any;                   //Id du timeout de 5min correspondant à la durée du tour

    newLetters: any[] = [];             //Tableau des lettres jouées pour le tour, contient des objets
    // { i: (index de la rangée), j: (index de la colonne), letter: (la lettre) }
    uniqueWordsCol: string[] = [];      //Tableau des nouveaux mots formés verticalement, organisés par colonne
    uniqueWordsRow: string[] = [];      //Tableau des nouveaux mots formés horizontalement, organisés par rangée
    newWords: any[] = [];               //Tableau regroupant tous les mots formés, contient des objets
    // { coordinates: (objet Coordinates), data: (le mot) }

    constructor(size: number) {
        this.board = new Board();
        this.size = size;
        this.reserve = new Reserve();
    }


    /*
    Ajoute un joueur à la partie si elle n'est pas encore pleine
    Si la partie devient pleine, le jeu commence
    -player: le joueur à ajouté
    -socket: son socket
    */
    addPlayer(player: any, socket: SocketIO.Socket) {
        console.log('Adding a player to a game of size', this.size);

        if (!this.full) {
            this.players.push(new Player(player.username, socket));
            console.log('The game needs', this.size - this.players.length, 'more players');
            this.broadcast('numPlayersLeft', (this.size - this.players.length).toString());
            this.full = this.players.length - this.size === 0;
            if (this.full) {
                this.start();
            }
        }
    }

    /*
    Enlève un joueur à la partie
    Ses lettres sont retournées à la réserve
    Si un seul joueur reste dans la partie, le tour arrêter
    -username: le username du joueur à enlever
    */
    removePlayer(username: string) {
        let i = this.findPlayerIndex(username);
        if (i === -1) {
            return;
        }

        //On enlève les lettres du chevalet si la partie est pleine, donc commencée
        //Autrement, le joueur n'a pas encore de lettres
        if (this.full) {
            this.broadcast('command', this.players[i].getUsername() + ' a quitté la partie');

            let rack = this.players[i].copyRack();
            for (let j = 0; j < rack.length; j++) {
                this.reserve.addLetters(rack[j]);
            }
            if (this.players[i].getBlankTiles() !== 0) {
                for (let j = 0; j < this.players[i].getBlankTiles(); j++) {
                    this.reserve.addLetters('*');
                }
            }
            this.broadcast("update_qty_reserve", this.reserve.getSize());
            this.players[i].deleteRack();

            //Si c'était le tour du joueur qui a quitté, on passe au prochain
            if (this.activePlayerIndex === i) {
                if (this.players.length > 2) {
                    this.nextTurn();
                }
            }
        }

        this.players.splice(i, 1);
        this.broadcast('numPlayersLeft', (this.size - this.players.length).toString());
        console.log("player", username, "deleted from the game");

        if (this.players.length === 0) {
            clearTimeout(this.turnPromise);
        }
        else if (this.players.length === 1) {
            this.players[0].endTurn();
        }
    }

    /*
    Commence la partie
    Crée la réserve
    Initialise les sockets pour écouter les futures commandes
    Envoit les chevalets
    Commence le tour du premier joueur
    */
    start() {
        console.log('game starting');

        this.broadcast('start_game', "");
        this.reserve.createReserve();

        //Mix l'ordre des joueurs
        this.randomizePlayerOrder();
        this.activePlayerIndex = 0;

        for (let i = 0; i < this.size; i++) {
            this.players[i].getSocket().on('user_input', (msg: string) => {
                this.parseCommand(msg, this.players[i]);
            });
        }

        this.sendRacks();

        let activePlayer = this.players[this.activePlayerIndex];
        this.broadcast('help', HELP);
        this.broadcast("new_turn", activePlayer.getUsername());
        activePlayer.startTurn();

        let self = this;
        this.turnPromise = setTimeout(function () {
            self.parseCommand("!passer", activePlayer);
        }, TURN_TIME_LIMIT);
    }

    /*
    Mélange l'ordre des joueurs pour la partie
     */
    randomizePlayerOrder() {
        for (let i = this.players.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.players[i];
            this.players[i] = this.players[j];
            this.players[j] = temp;
        }
    }

    /*
    Delete les infos utilisé lors du tour précédent afin de na pas interférer avec le prochain tour
     */
    clearRoundData() {
        this.newLetters = [];
        this.newWords = [];
        this.uniqueWordsCol = [];
        this.uniqueWordsRow = [];
    }

    /*
    Appelle clearRoundData()
    Annule le timeout du tour précédent
    Passe au prochain joueur et commence son tour
    */
    nextTurn() {
        this.clearRoundData();

        clearTimeout(this.turnPromise);
        this.players[this.activePlayerIndex].endTurn();

        let activePlayer = this.players[this.nextPlayer()];
        activePlayer.startTurn();

        let self = this;
        this.turnPromise = setTimeout(function () {
            self.parseCommand("!passer", activePlayer);
        }, TURN_TIME_LIMIT);

        this.broadcast("new_turn", activePlayer.getUsername());
    }

    /*
    Recoit tous messages envoyés par les joueurs
    Détecte si le message est un message de communication ou un commande de jeu
    -str: le message entrée
    -player: le joueur qui a entré la commande
     */
    parseCommand(str: string, player: Player) {
        while (str[0] === " ") {    //Enlève les espaces vides avant le message
            str = str.substr(1);
        }

        if (str[0] !== '!' && str) {     //Vérifie si le message est une commande à l'aide du caractère !
            let msg = player.getUsername() + ': ' + str;
            this.broadcast('chat_message', msg);
            return;
        }
        let cmd = str.substr(1); //Enlève "!"
        let words = cmd.split(" "); //Sépare la commande en un tableau de mot

        //words[0] contient la commande (ex: aide, placer, passer)
        //words[1] contient la case et l'orientation, ex: g15v = case g15 vertical
        //words[2] contient les lettres à placer
        if (words[0] === undefined || words[1] === undefined) {
            this.broadcast('command', 'Entrée invalide: ' + str);
            return;
        }
        this.play(words, player, str);
    }

    play(command: string[], player: Player, str: string) {
        if (command[0] === 'aide') {  //L'aide peut être envoyé n'importe quand
            this.sendHelp(player);
            return;
        }
        if (player.isActive()) { //Le reste des commandes peuvent seulement être envoyées si le joueur est actif
            this.broadcast('command', '(' + player.getUsername() + ') -> ' + str);   //on renvoit la commande entrée

            switch (command[0]) {
                case 'placer':
                    if (command[2] === undefined && command.length !== 3) {
                        this.broadcast('command', 'Entrée invalide: ' + str);
                        return;
                    }
                    this.clearRoundData();
                    this.placeWord(command[1], command[2], player);
                    break;
                case 'changer':
                    if (command.length !== 2) {
                        this.broadcast('command', 'Entrée invalide: ' + str);
                        return;
                    }
                    this.change(command[1], player);
                    break;
                case 'passer':
                    this.nextTurn();
                    break;
                default:
                    //erreur
                    this.broadcast('command', 'Entrée invalide: ' + str);

            }
        }
    }

    placeWord(cell: string, wordToPlay: string, player: Player) {
        let letters: string;
        let coordinates = this.parseCoordinates(cell.toUpperCase());
        letters = this.removeAccents(wordToPlay.toUpperCase());

        if (!this.checkForUserErrors(coordinates, letters)) {
            return;
        }
        console.log("Coordinates of the letters to place are", coordinates);
        console.log("Letters to play are", letters);

        if (!this.checkForTurnValidity(coordinates, letters)) {
            return;
        }

        let playerRack = player.copyRack();
        let usedLetters = "";                       //Lettres que le joueur doit utiliser pour former le mot
        let blankCounter = player.getBlankTiles();
        let tilesToAdd: Tile[] = [];                //Tuiles à ajouter au plateau
        let xMultiplier = 0;
        let yMultiplier = 0;

        for (let k = 0; k < letters.length; k++) {
            console.log("Checking for letter", letters[k]);
            if (coordinates.orientation === 'H') {
                yMultiplier = 1;
                console.log("word is horizontal");
            } else if (coordinates.orientation === 'V') {
                console.log("word is vertical");
                xMultiplier = 1;
            }
            if (this.board.getCell(coordinates.i + k * xMultiplier, coordinates.j + k * yMultiplier) === null) {
                console.log("cell", coordinates.i + k * xMultiplier, coordinates.j + k * yMultiplier, "is empty");
                let index = playerRack.indexOf(letters[k]);
                if (index > -1) {
                    console.log("Player has", letters[k], "and uses it");
                    playerRack.splice(index, 1);
                    usedLetters += letters[k];
                    tilesToAdd.push(new Tile(letters[k], false));
                    this.newLetters.push({
                        i: coordinates.i + k * xMultiplier,
                        j: coordinates.j + k * yMultiplier,
                        letter: letters[k]
                    });
                } else {
                    console.log("Player has no", letters[k], "in his rack");
                    if (blankCounter !== 0) {
                        console.log("Using blank tile for letter", letters[k]);
                        blankCounter--;
                        usedLetters += "*";
                        tilesToAdd.push(new Tile(letters[k], true));
                        this.newLetters.push({
                            i: coordinates.i + k * xMultiplier,
                            j: coordinates.j + k * yMultiplier,
                            letter: letters[k],
                            isBlank: true
                        });
                    } else {
                        console.log("No blank tiles available");
                        this.broadcast(
                            "command",
                            "Commande impossible à réaliser, le joueur n'as pas toute les lettres: "
                            + letters
                        );
                        return;
                    }
                }
            } else {
                if (this.board.getCell(coordinates.i + k * xMultiplier, coordinates.j + k * yMultiplier)
                    !== letters[k]) {
                    console.log(
                        "Cell not empty and contains different letter:",
                        this.board.getCell(coordinates.i + k * xMultiplier, coordinates.j + k * yMultiplier)
                    );
                    this.broadcast(
                        "command",
                        "Commande impossible à réaliser, le joueur n'as pas toute les lettres: "
                        + letters
                    );
                    return;
                }
                console.log("Letter", letters[k], "already on board");
                tilesToAdd.push(null);
            }
        }

        console.log("Used letters are", usedLetters);
        player.removeLetters(usedLetters);
        player.setBlankTiles(blankCounter);
        this.addLettersOnBoard(coordinates, tilesToAdd);

        if (this.isFirstTurn) {
            this.isFirstTurn = false;
        }
        console.log("New letters are -", this.newLetters);
        this.getWordsFromNewLetters();
        this.checkWordValidity(this.newWords, usedLetters, player);

    }

    checkForTurnValidity(coordinates: string, letters: string): boolean {
        if (this.isFirstTurn && !this.board.checkIfOnCenter(coordinates, letters.length)) {
            console.log("No letters were placed on the center cell");
            this.broadcast(
                'command',
                "Commande impossible à réaliser, une des lettres doit être placée sur la case centrale"
            );
            return false;
        }
        else if (!this.isFirstTurn && !this.board.isTouchingLetters(coordinates, letters.length)) {
            console.log("The letters are not touching any existing letters");
            this.broadcast(
                'command',
                "Commande impossible à réaliser, au moins une des lettres doit toucher une lettre existante"
            );
            return false;
        }
        return true;
    }

    checkForUserErrors(coordinates: string, letters: string): boolean {
        if (!coordinates) {
            console.log("The coordinates are invalid");
            this.broadcast('command', "Erreur de syntaxe, les coordonnées sont invalides");
            return false;
        }
        else if (!this.areLegitLetters(letters)) {
            console.log("The letters received have atleast one invalid character");
            this.broadcast(
                'command',
                "Erreur de syntaxe, la commande contenait au moins un caractère invalide"
            );
            return false;
        }
        else if (!this.board.hasRoom(coordinates, letters)) {
            console.log("No room, the desired positioning is impossible");
            this.broadcast(
                'command',
                "Commande impossible à réaliser, l'espace disponible est insuffisant"
            );
            return false;
        }
        return true;
    }

    checkWordValidity(newWords: any, usedLetters: string, player: Player) {
        let self = this;
        let isValidWord = true;
        setTimeout(function () {
            console.log('Time expired, checking word validity.');
            let i;
            for (i = 0; i < newWords.length; i++) {
                if (!Dictionary.isValid(newWords[i].word)) {
                    isValidWord = false;
                    break;
                }
            }
            if (isValidWord) {
                player.addScore(self.countScoreTotal());
                if (self.reserve.getSize() === 0 && player.getRackLength() < 7) {
                    console.log('endGame');
                    let winner = self.findWinner(player);
                    self.broadcast("command", winner.name + " a gagné la partie!");
                    self.broadcast("end_game", winner);
                    self.broadcast("command", "Pour revenir à la page de connection, appuyez sur ESC");
                } else {
                    if (self.reserve.getSize() !== 0) {
                        player.addLetters(self.reserve.getLetters(usedLetters.length));
                        self.broadcast("update_qty_reserve", self.reserve.getSize());
                    }
                    self.nextTurn();
                }
            } else {
                player.addLetters(usedLetters);
                self.broadcast("command", "Le mot " + self.newWords[i].word + ' n\'existe pas');
                for (let k = 0; k < self.newLetters.length; k++) {
                    console.log('removing letter: ' + self.newLetters[k].letter);
                    self.removeLetterFromBoard(self.newLetters[k].i, self.newLetters[k].j);
                }
                if (self.board.getCell(BOARD_CENTER, BOARD_CENTER) === null) {
                    self.isFirstTurn = true;
                }
                self.nextTurn();
            }
        }, DICTIONARY_TIME_LIMIT);
    }

    /*Determine le gagnant quand l'un des joueurs vide son chevalet et que la reserve est vide
    Retourne un objet winner
    */
    findWinner(player: Player): any {
        //TODO: gerer les egalites
        let winner: any;
        let isTie = false;
        let endGameBonus = this.getEndGameBonus();
        console.log("Bonus de fin de partie: " + endGameBonus + "à " + player.getUsername());
        player.addScore(endGameBonus);
        let index = 0;
        for (let i = 0; i < this.players.length - 1; i++) {
            if (this.players[i].getScore() < this.players[i + 1].getScore()) {
                index = i + 1;
            } else if (this.players[i].getScore() > this.players[i + 1].getScore()) {
                index = i;
            } else {
                isTie = true;
                if (this.players[i].getPreBonusScore() < this.players[i + 1].getPreBonusScore()) {
                    index = i + 1;
                } else if (this.players[i].getPreBonusScore() > this.players[i + 1].getPreBonusScore()) {
                    index = i;
                }
            }
        }
        if (isTie) {
            winner = { name: this.players[index].getUsername(), score: this.players[index].getPreBonusScore() };
        } else {
            winner = { name: this.players[index].getUsername(), score: this.players[index].getScore() };
        }
        this.updateScores(isTie);
        return winner;
    }

    /*Renvoie le total des valeurs tes tiles presentes dans le chevalet d'un joueur
    -player: le joueur dont on veut savoir le total
    */
    getEndGameBonus(): number {
        let endGameBonus = 0;
        console.log("Scores de fin de partie: \n");
        //pas besoin de traitement special pour joueur actif car son rack.length = 0
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setPreBonusScore(this.players[i].getScore());
            let rack = this.players[i].copyRack();
            for (let j = 0; j < this.players[i].getRackLength(); j++) {
                endGameBonus += this.pointCounter.findValue(rack[j]);
                this.players[i].setScore(this.players[i].getScore() - this.pointCounter.findValue(rack[j]));
                if (this.players[i].getScore() < 0) {
                    this.players[i].setScore(0);
                }
            }
            console.log(this.players[i].getUsername() + ": " + this.players[i].getScore());
        }
        return endGameBonus;
    }

    /*
    Échange les lettres fournies par le joueur
    -letters: les lettres à échanger
    -player: le joueur désirant l'échange
     */
    change(letters: string, player: Player) {
        letters = letters.toUpperCase();

        //letters contient les lettres à échanger dans la réserve
        if (this.areLegitLetters(letters)) {
            if (player.hasLetters(letters)) {
                player.removeLetters(letters);
                player.addLetters(this.reserve.changeLetters(letters));
                //arrêter le tour du joueur après l'échange
                this.nextTurn();
            }
            else {
                this.broadcast(
                    'command', "Commande impossible à réaliser, "
                    + player.getUsername()
                    + " n'a pas les lettres: " + letters
                );
            }
        }
        else {
            this.broadcast('command', "Erreur de syntaxe: " + letters);
        }
    }


    /*
    Place dans this.newWords tous les mots formés dans le tour
    avec les coordonnées de la première lettre du mot
     */
    getWordsFromNewLetters() {

        //Pour chaque lettre nouvellement ajoutée
        for (let k = 0; k < this.newLetters.length; k++) {
            let i = this.newLetters[k].i;
            let j = this.newLetters[k].j;

            //Si la lettre touche à au moins une lettre au-dessus ou au-dessous d'elle,
            //elle fait partie d'un mot

            if ((i - 1 >= 0 && this.board.getCell(i - 1, j) !== null)
                || (i + 1 < BOARD_SIZE && this.board.getCell(i + 1, j) !== null)) {
                //On récupère ce mot
                let potentialNewWord = this.board.getWordFromColumn(i, j);
                //Puisque nous testons chaque lettres ajoutées, il est fort probable
                //que plusieurs de ces lettres font partie du même mot.
                //Pour éviter les copies, on vérifie si le mot n'est pas déjà
                //dans la colonne
                if (!this.uniqueWordsCol[j]) {
                    //Si le mot est bel et bien unique, on l'ajoute à this.newWords
                    this.uniqueWordsCol[j] = potentialNewWord.word;
                    let coordinates = { i: potentialNewWord.i, j: potentialNewWord.j, orientation: 'V' };
                    this.newWords.push({
                        coordinates: coordinates,
                        word: potentialNewWord.word,
                        tiles: potentialNewWord.tiles
                    });
                }
            }

            //Si la lettre touche à au moins une lettre à sa gauche ou à sa droite,
            //elle fait partie d'un mot
            if (j - 1 >= 0 && j + 1 < BOARD_SIZE
                && (this.board.getCell(i, j - 1) !== null || this.board.getCell(i, j + 1) !== null)) {
                //On récupère ce mot
                let potentialNewWord = this.board.getWordFromRow(i, j);
                //Même principe qu'au-dessus, mais en vérifiant les rangées cette fois ci
                if (!this.uniqueWordsRow[i]) {
                    //Si le mot est bel et bien unique, on l'ajoute à this.newWords
                    this.uniqueWordsRow[i] = potentialNewWord.word;
                    let coordinates = { i: potentialNewWord.i, j: potentialNewWord.j, orientation: 'H' };
                    this.newWords.push({
                        coordinates: coordinates,
                        word: potentialNewWord.word,
                        tiles: potentialNewWord.tiles
                    });
                }
            }
        }
        console.log("new words are:");
        for (let n = 0; n < this.newWords.length; n++) {
            console.log(this.newWords[n].word);
        }
    }

    /*
    Compte le total des points du tour
    en additionnant le pointage de chaque nouveaux mots
     */
    countScoreTotal(): number {
        let total = 0;
        for (let n = 0; n < this.newWords.length; n++) {
            let singleWordScore = this.pointCounter.getScore(this.newWords[n].coordinates, this.newWords[n].tiles);
            total += singleWordScore;
            this.broadcast("command", "Le nouveau mot " + this.newWords[n].word
                + " vaut " + singleWordScore + " points");
            console.log("The word", this.newWords[n].word, "has a score of", singleWordScore);
        }
        this.pointCounter.clearMultipliers(this.newLetters);

        if (this.newLetters.length === 7) {
            total += 50;
            this.broadcast("command", "Bingo! Bonus de 50 points pour avoir utilisé 7 lettres");
        }

        return total;
    }

    /*
    Met a jour les scores de tous les joueurs en fin de partie
    -isTie: en cas d'egalite, envoie les scores avant l'application des bonus/penalites de fin de partie
    */
    updateScores(isTie: boolean) {
        for (let i = 0; i < this.players.length; i++) {
            if (isTie) {
                this.players[i].emit('update_score', this.players[i].getPreBonusScore());
            } else {
                this.players[i].emit('update_score', this.players[i].getScore());
            }
        }
    }


    /*
    Prend les coordonnées en string et les transforme en object { i: row, j: col, orientation: orientation }
    Retourne false si les coordonnées fournies sont invalides
    -coordinates: les coordonnées en string
     */
    parseCoordinates(coordinates: string): any {

        if (coordinates.length < 3 || coordinates.length > 4) {
            return false;
        }
        coordinates = coordinates.toUpperCase();

        if (coordinates[0] < 'A' || coordinates[0] > 'Z') {
            return false;
        }

        let row = coordinates[0].charCodeAt(0) - 65;
        let orientation = coordinates[coordinates.length - 1];
        let colStr = coordinates.substr(1, coordinates.length - 2);

        if (colStr.match(/[A-Z]/i)) {
            return false;
        }
        let col = parseInt(colStr, 10) - 1;

        if (row === -1 || (orientation !== 'H' && orientation !== 'V') || (col < 0 && col >= BOARD_SIZE)) {
            return false;
        }

        return { i: row, j: col, orientation: orientation };
    }

    /*
    Prend les lettres en string et remplace les lettres accentuees par leur equivalent sans accents
    Retourne le string d'origine s'il ne comporte pas d'accents
    -letters: les lettres en string
     */
    removeAccents(letters: string): string {
        let changes = DIACRITICS_MAP;
        for (let i = 0; i < DIACRITICS_MAP.length; i++) {
            for (let j = 0; j < changes[i].letters.length; j++) {
                letters = letters.replace(changes[i].letters[j], changes[i].base);
            }
        }
        return letters;
    }

    /*
    Ajoute la lettre sur le plateau de jeu
    -i: index de la rangée
    -j: index de la colonne
    -letter: lettre à ajouter
     */
    addLetterOnBoard(i: number, j: number, tile: Tile) {
        //this.newLetters.push({ i: i, j: j, letter: letter });
        this.broadcast("add_board_tile", { i: i, j: j, tile: tile });
        this.board.addTile(i, j, tile);
        console.log("Cell added at", i, j, ":", this.board.getCell(i, j));
    }

    addLettersOnBoard(coordinates: any, tiles: Tile[]) {
        if (coordinates.orientation === 'V') {
            for (let k = 0; k < tiles.length; k++) {
                if (tiles[k] !== null) {
                    this.addLetterOnBoard(coordinates.i + k, coordinates.j, tiles[k]);
                }
            }
        }
        else {
            for (let k = 0; k < tiles.length; k++) {
                if (tiles[k] !== null) {
                    this.addLetterOnBoard(coordinates.i, coordinates.j + k, tiles[k]);
                }
            }
        }
    }

    /*
    Enlève la lettre du plateau de jeu
    -i: index de la rangée
    -j: index de la colonne
     */
    removeLetterFromBoard(i: number, j: number) {
        this.broadcast("remove_board_tile", { i: i, j: j });
        this.board.removeLetter(i, j);
    }

    /*
    Envoit un message à tous les joueurs de la partie
    -type: le type de message
    -msg: les données à transmettre
     */
    broadcast(type: string, msg: any) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].emit(type, msg);
        }
    }

    /*
    Envoit le message d'aide au joueur qui a entré la demande
    Le message est envoyé à lui seulement afin d'éviter le spam
    dans les boîtes de communication des autres joueurs
    -player: le joueur qui a demandé l'aide
     */
    sendHelp(player: Player) {
        player.emit('help', HELP);
    }

    /*
    Distribue les chevalets à tous les joueurs
    */
    sendRacks() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].addLetters(this.reserve.getLetters(RACK_MAX_SIZE));
        }
        this.broadcast("update_qty_reserve", this.reserve.getSize());
    }

    /*
    Retourne l'index du joueur correspondant au username
    -username: le username du joueur recherché
     */
    findPlayerIndex(username: string): number {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getUsername() === username) {
                return i;
            }
        }
        return -1;
    }

    /*
    Retourne l'index du prochain joueur à jouer
     */
    nextPlayer(): number {
        if (++this.activePlayerIndex === this.players.length) {
            this.activePlayerIndex = 0;
        }
        console.log("next player:", this.players[this.activePlayerIndex].getUsername());
        return this.activePlayerIndex;
    }

    /*
    Vérifie si les lettres entrées sont contiennent des caractères invalides
    -letters: les lettres à vérifier
     */
    areLegitLetters(letters: string): boolean {
        for (let i = 0; i < letters.length; i++) {
            if ((letters[i] < 'A' || letters[i] > 'Z') && letters[i] !== '*') {
                return false;
            }
        }
        return true;
    }
}
