class Board{
    constructor() {
        this.game = new Array(9).fill(null);
        this.winStates = [
            [0, 1, 2], [3, 4, 5],[6, 7, 8],
            [0, 3, 6], [1, 4, 7],[2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        this.turn = 0; // first player in the array
    }

    getTurn() {
        return this.turn;
    }

    updateBoard(index, piece) {
        if (this.game[index]) return false; // tile occupied
        this.game[index] = piece;
        if (this.turn == 0) this.turn = 1; //switch turns
        else this.turn = 0;
        return true; //updated successfully
    }

    isWinner() {
        for (let winState of this.winStates) {
            let piece = this.game[winState[0]];
            if (piece != null) {
                if (this.game[winState[1]] == piece && this.game[winState[2]] == piece) {
                    return true;
                }
            } 
        }
        return false;
    }

    isDraw() {
        for (let tile of this.game) {
            if (tile == null) {
                return false;
            }
        }
        return true;
    }

    getArray() {
        return this.game;
    }
}

module.exports = Board;