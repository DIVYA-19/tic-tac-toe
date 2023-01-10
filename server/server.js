const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const Player = require('./Player')
const TicTacToe = require('./TicTacToe')
const utils = require('./utils')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT;

var server = app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

const rooms = new Map();

const io = socket(server)
app.use(cors)


const createRoom = (room) => {
    rooms.set(room, { roomId: room, players: [], "board": TicTacToe })
}

const joinRoom = (player, room) => {
    if (!rooms.get(room)) {
        createRoom(room)
    }
    curRoom = rooms.get(room);
    curRoom.players.push(player);
}

io.on('connection', (socket) => {
    socket.on('newGame', () => {

    })

    socket.on('join-room', ({ room, game, name }) => {

        if (room === '' || name === '') {
            // 
        }

        socket.join(room);
        const id = socket.id;
        var symbol = "O"
        if (rooms.get(room) && rooms.get(room).players != null) { symbol = "X" }
        const newPlayer = new Player(name, room, id, symbol);

        joinRoom(newPlayer, room);
        io.in(room).emit("players-data", rooms.get(room).players);
    })

    socket.on("update-game-state", ({ state, room }) => {
        curRoom = rooms.get(room);
        curRoom.board.state = state;
        io.in(room).emit("update-game-state", state);
        const gameOver = utils.gameOver(state);
        if (gameOver != false) {
            io.in(room).emit("game-over", gameOver);
        }
    })

    socket.on("players-data", ({ room }) => {
        curRoom = rooms.get(room);
        io.in(room).emit("players-data", curRoom.players)
    })

    socket.on("update score", ({ score, room }) => {
        curRoom = rooms.get(room);
        curRoom.players.map(player => {
            if (player.id === socket.id) {
                player.score += score;
            }
        })
        io.in(room).emit("room data", curRoom.players);
    })

    socket.on("current-player", ({ room, currentPlayer }) => {
        curRoom = rooms.get(room);
        curRoom.board.currentPlayer = currentPlayer;
        io.in(room).emit("current-player", curRoom.board.currentPlayer);
    })

})