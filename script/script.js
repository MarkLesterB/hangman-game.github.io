const hangmanImage = document.querySelector('.hangman-box img');
const wordDisplay = document.querySelector('.word-display');
const guessesCount = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard');
const gameModal = document.querySelector('.game-modal');
const playAgainBtn = document.querySelector('.play-again');
const timerDisplay = document.querySelector('.timer');

let currentWord, correctLetter = [], wrongGuessCount = 0, timer;
const maxGuess = 6;
const gameTimeInSeconds = 60;

const resetGame = () => {
    correctLetter = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesCount.innerText = `${wrongGuessCount} / ${maxGuess}`
    keyboardDiv.querySelectorAll('button').forEach(btn => btn.disabled = false)
    wordDisplay.innerHTML = currentWord.split('').map(() => `<li class="letter"></li>`).join('');
    gameModal.classList.remove("show");
    resetTimer();
    startTimer();
}

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector('.hint-text b').innerText = hint;
    resetGame();
};

const gameOver = (isVictory) => {
    clearInterval(timer);
    setTimeout(() => {
        const modalText = isVictory ? `You Guessed it, it was ` : `Too Bad it was `;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`
        gameModal.querySelector("h1").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`
        gameModal.classList.add("show");
    }, 300);
}

const startTimer = () => {
    let timeLeft = gameTimeInSeconds;
    updateTimerDisplay(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft === 0) {
            clearInterval(timer);
            gameOver(false);
        }
    }, 1000);
}

const updateTimerDisplay = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const resetTimer = () => {
    clearInterval(timer);
    updateTimerDisplay(gameTimeInSeconds);
}

const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetter.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }
    else {
         wrongGuessCount++;
         hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
         updateTimerForWrongGuess();
    }
    button.disabled = true;
    guessesCount.innerText = `${wrongGuessCount} / ${maxGuess}`

    if(wrongGuessCount === maxGuess) return gameOver(false);
    if(correctLetter.length === currentWord.length) return gameOver(true);
}

const updateTimerForWrongGuess = () => {
    const currentTime = timerDisplay.innerText.split(':');
    let remainingTimeInSeconds = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]);
    remainingTimeInSeconds -= 5;
    if (remainingTimeInSeconds < 0) remainingTimeInSeconds = 0;
    clearInterval(timer);
    startTimerWithRemainingTime(remainingTimeInSeconds);
}

const startTimerWithRemainingTime = (remainingTimeInSeconds) => {
    updateTimerDisplay(remainingTimeInSeconds);
    timer = setInterval(() => {
        remainingTimeInSeconds--;
        updateTimerDisplay(remainingTimeInSeconds);
        if (remainingTimeInSeconds === 0) {
            clearInterval(timer);
            gameOver(false);
        }
    }, 1000);
}

for(let i = 97; i <= 122; i++) {
    const button = document.createElement('button')
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord);
