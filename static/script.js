const gameContainer = document.getElementById("game-container");

let gameData = null;
let currentPlayerIndex = 0;
let revealed = false;


async function startGame() {

    const response = await fetch("/start-game", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            player_count: 5,
            imposter_count: 1,
            mode: "related",
            difficulty: "random",
            starting_player: 1
        })
    });

    gameData = await response.json();

    currentPlayerIndex = 0;

    showPlayerScreen();
}


function showPlayerScreen() {

    const player = gameData.players[currentPlayerIndex];

    gameContainer.innerHTML = `
    
        <h1>Player ${player.player}</h1>

        <button id="reveal-btn">
            Reveal Word
        </button>

    `;

    document
        .getElementById("reveal-btn")
        .addEventListener("click", showWord);
}


function showWord() {

    const player = gameData.players[currentPlayerIndex];

    gameContainer.innerHTML = `
    
        <h1>${player.word}</h1>

        <button id="next-btn">
            Hide & Pass
        </button>

    `;

    document
        .getElementById("next-btn")
        .addEventListener("click", nextPlayer);
}


function nextPlayer() {

    currentPlayerIndex++;

    if (currentPlayerIndex >= gameData.players.length) {
        showFinalScreen();
    }

    else {
        showPlayerScreen();
    }
}


function showFinalScreen() {

    gameContainer.innerHTML = `
    
        <h1>Discussion Time</h1>

        <button id="reveal-imposter-btn">
            Reveal Imposter
        </button>

    `;

    document
        .getElementById("reveal-imposter-btn")
        .addEventListener("click", revealImposter);
}


function revealImposter() {

    gameContainer.innerHTML = `
    
        <h2>Main Word: ${gameData.main_word}</h2>

        <h2>Imposter Word: ${gameData.imposter_word}</h2>

        <h2>Imposters: ${gameData.imposter_ids.join(", ")}</h2>

        <button onclick="startGame()">
            Play Again
        </button>

    `;
}


document
    .getElementById("start-btn")
    .addEventListener("click", startGame);