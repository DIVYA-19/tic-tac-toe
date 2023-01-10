SIZE = 10

onmessage = function (event) {
    if (event && event.data) {
        const positions = horizontalWord(
            event.data.i,
            event.data.j,
            event.data.wordMatrix,
            event.data.WORDS
        );
        postMessage(positions);
    }
};

function horizontalWord(i_, j_, wordMatrix, WORDS) {
    const wordMatrixTrans = wordMatrix[0]
        .map((_, c) => wordMatrix.map((r) => r[c]))
        .reverse();

    let dummy = [];
    for (let row = 0; row < SIZE; row++) {
        const rowArray = [];
        for (let col = 0; col < SIZE; col++) {
            rowArray.push([row, col]);
        }
        dummy.push(rowArray);
    }
    dummy.reverse();
    dummy = dummy[0].map((_, c) => dummy.map((r) => r[c]));
    const [i, j] = dummy[i_][j_];

    let position;
    let maxLen = 0;
    for (let col = 0; col < j+1; col++) {
        for (let col2 = j; col2 < SIZE; col2++) {
            const word = wordMatrixTrans[i]
                .slice(col, col2 + 1)
                .join('')
                .toLowerCase()
                .trim();
            const wordReversed = word.split('').reverse().join('');
            const foundReversed = WORDS.indexOf(wordReversed);
            const found = WORDS.indexOf(word);
            if ((found > -1 | foundReversed > -1) && word.length > 1 && word.length > maxLen) {
                maxLen = word.length;
                position = [col, col2 + 1, j_];
            }
        }
    }
    return {score:maxLen, position};
}
