document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.memory-game');
    const movesSpan = document.getElementById('moves');
    const timeSpan = document.getElementById('time');
    const restartBtn = document.getElementById('restart-btn');
    
    // Modal elements
    const winModal = document.getElementById('win-modal');
    const winForm = document.getElementById('win-form');
    const playerNameInput = document.getElementById('player-name');

    // Leaderboard elements
    const leaderboardList = document.getElementById('leaderboard-list');

    const characters = ['Ryu', 'Ken', 'ChunLi', 'Guile', 'Blanka', 'E.Honda'];
    let cardsArray = [...characters, ...characters];

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer;
    let seconds = 0;
    let matchedPairs = 0;

    // --- Leaderboard Logic ---
    function loadLeaderboard() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        leaderboardList.innerHTML = ''; // Clear existing list

        highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${score.name}</span><span>${score.time}s</span>`;
            leaderboardList.appendChild(li);
        });
    }

    // --- Fisher-Yates Shuffle Algorithm ---
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Game Timer ---
    function startTimer() {
        seconds = 0;
        timeSpan.textContent = `${seconds}s`;
        if(timer) clearInterval(timer); // Clear any existing timer
        timer = setInterval(() => {
            seconds++;
            timeSpan.textContent = `${seconds}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    // --- Create and Display Cards ---
    function generateCards() {
        shuffle(cardsArray);
        gameBoard.innerHTML = '';
        cardsArray.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.framework = character;
            card.innerHTML = `
              <div class="front-face">
                <img src="img/${character}.png" alt="${character}" />
              </div>
              <div class="back-face">
                <img src="img/Logo.png" alt="Street Fighter Logo" />
              </div>
            `;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // --- Main Game Logic ---
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            if (moves === 0 && seconds === 0) {
                startTimer();
            }
            return;
        }

        secondCard = this;
        hasFlippedCard = false;
        incrementMoves();
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        checkWinCondition();
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function incrementMoves() {
        moves++;
        movesSpan.textContent = moves;
    }

    // --- Win Condition and Score Saving ---
    function checkWinCondition() {
        if (matchedPairs === characters.length) {
            stopTimer();
            showWinModal();
        }
    }

    function showWinModal() {
        document.getElementById('final-time').textContent = `${seconds}s`;
        document.getElementById('final-moves').textContent = moves;
        winModal.style.display = 'flex';
    }

    function handleWinFormSubmit(event) {
        event.preventDefault();
        const playerName = playerNameInput.value || 'Player';
        saveScore(playerName, seconds);
        winModal.style.display = 'none';
        playerNameInput.value = '';
        restartGame();
    }

    function saveScore(name, time) {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = { name, time };
        highScores.push(newScore);
        highScores.sort((a, b) => a.time - b.time);
        const top10Scores = highScores.slice(0, 10);
        localStorage.setItem('highScores', JSON.stringify(top10Scores));
        loadLeaderboard();
    }

    // --- Restart Game ---
    function restartGame() {
        stopTimer();
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        movesSpan.textContent = '0';
        timeSpan.textContent = '0s';
        resetBoard();
        generateCards();
    }

    // --- Event Listeners ---
    restartBtn.addEventListener('click', restartGame);
    winForm.addEventListener('submit', handleWinFormSubmit);

    // --- Initial Game Start ---
    loadLeaderboard();
    generateCards();
});