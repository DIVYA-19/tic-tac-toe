import { useState, useEffect } from 'react'
import './tictactoe.css'
import { socket } from '../../socket.js'
import { Modal, Text, Button, Input } from '@mantine/core';

const TicTacToe = (props) => {
    const [opened, setOpened] = useState(true);
    const [winnerDialog, setWinnerDialog] = useState(false);
    const [name, setName] = useState('')
    const [player2, setPlayer2] = useState('')
    const [gameOver, setGameOver] = useState('')
    const [room, setRoom] = useState('')
    const [gameState, setGameState] = useState({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' });
    const [pressedKey, setPressedKey] = useState(null);
    const [scoreValues, setScoreValues] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('O');
    const [symbol, setSymbol] = useState('');
    const [message, setMessage] = useState('');
    const [resetClicked, setResetClicked] = useState(false);

    const handleClick = (index) => {
        if (gameState[index] !== "") return
        if (currentPlayer !== symbol) {
            setMessage("not your move!!!")
        } else if (player2 == "") {
            setMessage("Other player hasn't joined yet!")
        }
        else {
            setPressedKey(true);
            setGameState(gameState => ({ ...gameState, [index]: currentPlayer }))
            setCurrentPlayer(currentPlayer => (currentPlayer === "O" ? "X" : "O"))
        }

    }

    const reset = () => {
        setResetClicked(true)
        setGameState({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' })
    }

    const populateGame = () => {
        if (gameState != null) {
            var result = [];
            console.log(gameState)
            Object.keys(gameState).forEach((currentValue, index) => {
                result.push(<div id="space0" key={index} onClick={() => handleClick(index)} className="space">{gameState[currentValue]}</div>)
            })

        }
        return result
    }

    useEffect(() => {
        if (pressedKey || resetClicked) {
            socket.emit("update-game-state", { state: gameState, room })
            socket.emit("current-player", { room, currentPlayer });
            setPressedKey(false);
            setResetClicked(false);
            setWinnerDialog(false);
        }
    }, [gameState, currentPlayer])

    useEffect(() => {
        socket.on("update-game-state", matrix => setGameState(matrix));
        socket.on("players-data", data => {
            const symbol_ = data.filter(player => player.id === socket.id)[0].symbol;
            const otherPlayer = data.filter(player => player.id !== socket.id)[0];
            if (otherPlayer) setPlayer2(otherPlayer.name)
            if (data.length >= 1) {
                setSymbol(symbol_)
            } else {
                setSymbol(symbol_)
            }
        });
        socket.on("current-player", player => {
            setMessage('')
            setCurrentPlayer(player)
        })
        socket.on("game-over", winner => {
            setGameOver(winner)
            setWinnerDialog(true)
        })
    })
    const spaces = populateGame();

    return (
        <div className='tictactoe'>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Create or Join a room"
            >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <label> Name: <Input onChange={(e) => setName(e.target.value)} /> </label> <br />
                    <label> Room: <Input onChange={(e) => setRoom(e.target.value)} /> </label> <br />
                    <Button style={{ marginTop: "1rem" }} onClick={() => {
                        setOpened(false);
                        socket.emit('join-room', { room: room, game: 'tictactoe', name })
                    }}>submit</Button>
                </div>
            </Modal>
            <Modal
                opened={winnerDialog}
                withCloseButton
                title={`Winner!!!`}
                onClose={() => setWinnerDialog(false)}
            >
                <Text size="lg" style={{ marginBottom: 10 }} weight={500}>
                    {gameOver == "draw" ? gameOver : (symbol === gameOver ? `🎉 ${name}` : `🎉 ${player2}`)}
                </Text>
                {gameOver == "draw" ? <Button>restart</Button> : null}
            </Modal>
            <div className="full-page" id="full-page">
                <div className="options startReset flex-row wrap">
                    <div id="start">Start</div>
                    <div id="reset" onClick={reset}>Reset</div>
                </div>
                <div className="scoreboard">
                    <div className="Room">Room: {room}</div>
                    <div className="player1">{`${name} (${symbol})`}: 0</div>
                    <div className="player2">{`${player2} (${symbol === "O" ? "X" : "O"})`}: 0</div>
                    <div className='turn'>Turn: {currentPlayer}</div>
                </div>
                <div>{message}</div>
                <div className="boardcontainer">
                    <div className="board">
                        {spaces}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicTacToe;