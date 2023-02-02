const possibleWinPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

const gameOver = (state) => {
    var winner = false;
    possibleWinPositions.map(position => {
        if (state[position[0]] != '' && state[position[0]] == state[position[1]] && state[position[1]] == state[position[2]]) {
            winner = state[position[0]];
        }
    })
    if (!winner) {
        const emptyPositions = Object.keys(state).filter(position => state[position] == "");
        if (emptyPositions.length <= 0) {
            return "draw";
        }
    }
    return winner;
}

module.exports = { gameOver }