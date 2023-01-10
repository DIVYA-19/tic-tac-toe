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

function horizontalWord(i, j, wordMatrix, WORDS) {
    let position;
    let maxLen = 0;
    for (let col = 0; col < j+1; col++) {
        for (let col2 = j; col2 < SIZE; col2++) {
            const word = wordMatrix[i]
                .slice(col, col2 + 1)
                .join('')
                .toLowerCase()
                .trim();
            const wordReversed = word.split('').reverse().join('');
            const found = WORDS.indexOf(word);
            const foundReversed = WORDS.indexOf(wordReversed);
            if ((found > -1 | foundReversed > -1)  && word.length > 1 && word.length > maxLen) {
                maxLen = word.length;
                position = [col, col2 + 1, i];
            }
        }
    }
    return {score: maxLen, position};
}
