
export class Dictionary {
    static dictionary = require('../app/dictionary.js');

    static isValid(word: string): boolean {
            return (this.dictionary.indexOf(word) > -1);
    }
}
