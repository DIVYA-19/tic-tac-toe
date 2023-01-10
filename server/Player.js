class Player {
    constructor(name, room, id, symbol) {
        this.name = name
        this.room = room
        this.symbol = symbol
        this.id = id
        this.score = 0
        this.restart = false
    }
}

module.exports = Player