const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.boardSet'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.start-btn'),
    reset: document.querySelector('.reset-btn'),
    modeBtn: document.querySelector('.mode-btn'),
    dimensionSelect: document.querySelector('#dimension-select'),
    win: document.querySelector('.win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    oldDimensions: 4,
    modeNum: 0,
    ismodeEnabled: false
};

const resetGameState = () => {
    state.gameStarted = false;
    state.totalFlips = 0;
    state.totalTime = 0;
    state.oldDimensions = 4;
    clearInterval(state.loop);
};

const shuffleArray = array => {
    const clonedArray = [...array];

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const original = clonedArray[i];

        clonedArray[i] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
};

const pickRandomElements = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);

        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
};


const setupGameBoard = () => {
    state.oldDimensions = parseInt(selectors.dimensionSelect.value);
    let dimensions = state.oldDimensions;
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    const totalImages = 32;
    const imageUrls = Array.from({ length: totalImages }, (_, i) => `img/anime/${String(i + 1).padStart(2, '0')}.jpg`);

    const totalBgImages = 3;
    const bgImage = `img/card/${(Math.floor(Math.random() * totalBgImages) + 1).toString().padStart(2, '0')}.jpg`;

    if (imageUrls.length < dimensions * dimensions / 2) {
        const repeatImageUrls = [];

        for (let i = 0; i < dimensions * dimensions / 2; i++) {
            repeatImageUrls.push(imageUrls[i % imageUrls.length]);
        }

        imageUrls.push(...repeatImageUrls);
    }

    const items = pickRandomElements(imageUrls, dimensions * dimensions / 2);
    const cards = items.concat(items);
    const shuffledCards = shuffleArray(cards);

    selectors.board.innerHTML = '';
    const boardElement = document.createElement('div');
    boardElement.classList.add('board');
    boardElement.style.gridTemplateColumns = `repeat(${dimensions}, auto)`;

    shuffledCards.forEach((cardPath) => {
        const fileName = cardPath.match(/\/([^/]+)$/)[1];
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        cardElement.innerHTML = `
            <div class="card-front" style="background-image: url('${bgImage}');"></div>
            <div class="card-back">
                <img src="${cardPath}" alt="${fileName}" data-id="${fileName}">
            </div>
        `;
        boardElement.appendChild(cardElement);
    });

    selectors.board.innerHTML = '';
    selectors.board.appendChild(boardElement);
};

const originalJS = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    const imageUrls = [
        'img/anime/01.jpg',
        'img/anime/02.jpg',
        'img/anime/03.jpg',
        'img/anime/04.jpg',
        'img/anime/05.jpg',
        'img/anime/06.jpg',
        'img/anime/07.jpg',
        'img/anime/08.jpg',
        'img/anime/09.jpg',
        'img/anime/10.jpg',
        'img/anime/11.jpg',
        'img/anime/12.jpg'
    ];

    const totalCards = dimensions * dimensions;
    const pairsNeeded = totalCards / 2;

    let items = [];
    let pickedImages = [];

    while (items.length < pairsNeeded) {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        const randomImage = imageUrls[randomIndex];

        if (!pickedImages.includes(randomImage)) {
            pickedImages.push(randomImage);
            items.push(randomImage);
        }

        if (pickedImages.length === imageUrls.length) {
            pickedImages = [];
        }
    }
    items = shuffleArray([...items, ...items]);

    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${item}" alt="${item}" data-id="${item}"></div>
                </div>
            `).join('')}
        </div>
    `;
    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.innerHTML = '';
    selectors.board.replaceWith(parser.querySelector('.board'));
};

const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
    selectors.reset.classList.remove('disabled');
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped');
    });

    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped');
        });

        state.loop = setInterval(() => {
            state.totalTime++;
            selectors.timer.innerText = `Time: ${state.totalTime} sec`;
            selectors.moves.innerText = `Moves: ${state.totalFlips} step`;
        }, 1000);
    }, state.modeNum);
};

const resetGame = () => {
    flipBackCards();
    resetGameState();
    selectors.start.classList.remove('disabled');
    selectors.boardContainer.classList.remove('flipped');
    selectors.reset.classList.add('disabled');
    selectors.timer.innerText = 'Time: 0 sec';
    selectors.moves.innerText = 'Moves: 0 step';
    setTimeout(() => {
        setupGameBoard();
    }, 500);
};

const flipBackCards = () => {
    document.querySelectorAll('.card.flipped:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });

    state.flippedCards = 0;
};

const flipCard = card => {
    if (!state.gameStarted) {
        return;
    }

    state.flippedCards++;
    
    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }
    if (state.flippedCards === 2) {
        state.totalFlips++;
        setTimeout(() => {
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
            if (flippedCards[0].querySelector('img').dataset.id === flippedCards[1].querySelector('img').dataset.id) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
            }
            flipBackCards();

            if (!document.querySelectorAll('.card:not(.matched)').length) {
                setTimeout(() => {
                    selectors.boardContainer.classList.add('flipped');
                    selectors.win.innerHTML = `
                        <span class="win-text">
                            You win!<br/>
                            With <span class="highlight">${state.totalFlips}</span> moves<br/>
                            Under <span class="highlight">${state.totalTime}</span> seconds
                        </span>
                    `;
                    clearInterval(state.loop);
                }, 500);
            }
        }, 1000);
    }
};

const registerGameEventListeners = () => {
    selectors.reset.classList.add('disabled');
    let ismodeEnabled = false;
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;
        if(ismodeEnabled)
            createRaindrop();

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped') && state.gameStarted) {
            flipCard(eventParent);
        } else if (eventTarget.className === 'start-btn' && !eventTarget.className.includes('disabled')) {
            startGame();
        } else if (eventTarget.className === 'reset-btn' && !eventTarget.className.includes('disabled')) {
            resetGame();
        } else if (eventTarget.className === 'mode-btn') {
            ismodeEnabled = !ismodeEnabled;
            // if(ismodeEnabled)
            //     state.modeNum = 2000;
            // else
            //     state.modeNum = 0;
            selectors.modeBtn.textContent = ismodeEnabled ? "T" : "F";
        }
    });

    selectors.dimensionSelect.addEventListener('change', () => {
        if (state.oldDimensions !== parseInt(selectors.dimensionSelect.value)) {
            resetGame();
        }
    });
};

setupGameBoard();
registerGameEventListeners();
