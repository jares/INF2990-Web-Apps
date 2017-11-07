const ONE_TILE = ['J', 'K', 'Q', 'W', 'X', 'Y', 'Z'];
const TWO_TILES = ['B', 'C', 'F', 'G', 'H', 'P', 'V', '*'];
const THREE_TILES = ['D', 'M'];
const FIVE_TILES = ['L'];
const SIX_TILES = ['N', 'O', 'R', 'S', 'T', 'U'];
const EIGHT_TILES = ['I'];
const NINE_TILES = ['A'];
const FIFTEEN_TILES = ['E'];
const ALPHABET = ['*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const enum letterCount { ONE = 1, TWO = 2, THREE = 3, FIVE = 5, SIX = 6, EIGHT = 8, NINE = 9, FIFTEEN = 15}

export class Reserve {
    bag: string[] = [];

    getLetterCount(letter: string): number {
        if (ONE_TILE.indexOf(letter)) {
            return letterCount.ONE;
        }
        if (TWO_TILES.indexOf(letter)) {
            return letterCount.TWO;
        }
        if (THREE_TILES.indexOf(letter)) {
            return letterCount.THREE;
        }
        if (FIVE_TILES.indexOf(letter)) {
            return letterCount.FIVE;
        }
        if (SIX_TILES.indexOf(letter)) {
            return letterCount.SIX;
        }
        if (EIGHT_TILES.indexOf(letter)) {
            return letterCount.EIGHT;
        }
        if (NINE_TILES.indexOf(letter)) {
            return letterCount.NINE;
        }
        if (FIFTEEN_TILES.indexOf(letter)) {
            return letterCount.FIFTEEN;
        }
    }

    createReserve() {
        let count = 0;
        for (let letter of ALPHABET) {
            count = this.getLetterCount(letter);
            for (let i = 0; i < count; i++) {
                this.bag.push(letter);
            }
        }
    }

    addLetters(letters: string) {
        for (let i = 0; i < letters.length; i++) {
            this.bag.push(letters[i]);
        }
    }

    getLetter(): string {
        let index = Math.floor(Math.random() * this.bag.length);
        let tile = this.bag[index];
        this.bag.splice(index, 1);
        return tile;
    }

    getLetters(n: number): string {
        console.log("getting", n, "letters from the bag");
        if (this.getSize() === 0) {
            console.log("No letters left");
            return;
        }
        let letters = "";
        for (let i = 0; i < n; i++) {
            letters += this.getLetter();
        }
        console.log("result is", letters);
        return letters;
    }

    changeLetters(letters: string): string {
        this.addLetters(letters);
        return this.getLetters(letters.length);
    }

    getSize(): number {
        console.log("The reserve has", this.bag.length, "letters left");
        return this.bag.length;
    }
}
