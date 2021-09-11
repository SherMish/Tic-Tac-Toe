class Player {
    constructor(name, id, piece='') {
        this.name = name;
        this.id = id;
        this.piece = piece;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }
    
    getPiece() {
        return this.piece;
    }
}

module.exports = Player