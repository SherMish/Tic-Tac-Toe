class Board{
    constructor() {
        this.game = new Array(9).fill(null);
        this.winStates = [
            [0, 1, 2], [3, 4, 5],[6, 7, 8],
            [0, 3, 6], [1, 4, 7],[2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        this.end = false
        this.turn = 0; // first player in the array
        this.switch = new Map([['X', 'O'], ['O', 'X']])
    }

    getTurn() {
        return this.turn;
    }

    updateBoard(index, piece) {
        if (this.game[index]) return false;
        this.game[index] = piece;
        if (this.turn == 0) this.turn = 1;
        else this.turn = 0;
        return true;
    }

    isWinner() {
        for (let winState of this.winStates) {
            let piece = this.game[winState[0]];
            if (piece) {
                if (this.game[winState[1]] == piece && this.game[winState[2]] == piece) {
                    return true;
                }
            } 
        }
        return false;
    }

    getArray() {
        return this.game;
    }
}

module.exports = Board;