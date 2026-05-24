/* =========================================
   IMPOSTER GAME — script.js
   ========================================= */

// ---------- State ----------
let gameData        = null;
let currentPlayerIndex = 0;

const settings = {
    player_count:     4,
    imposter_count:   1,
    starting_player:  1,
    mode:             "related",
    difficulty:       "random"
};

// ---------- DOM References ----------
const screens = {
    setup:   document.getElementById("screen-setup"),
    pass:    document.getElementById("screen-pass"),
    word:    document.getElementById("screen-word"),
    discuss: document.getElementById("screen-discuss"),
    reveal:  document.getElementById("screen-reveal"),
    loading: document.getElementById("screen-loading")
};

// ---------- Screen Router ----------
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

// ---------- Theme ----------
function initTheme() {
    const saved = localStorage.getItem("imposter-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
    document.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾";
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("imposter-theme", next);
    updateThemeIcon(next);
});

// ---------- Settings panel ----------
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel  = document.getElementById("settings-panel");
const settingsArrow  = document.getElementById("settings-arrow");

settingsToggle.addEventListener("click", () => {
    const isOpen = settingsPanel.classList.toggle("open");
    settingsArrow.classList.toggle("open", isOpen);
});

// ---------- Stepper builder ----------
function bindStepper(minusId, plusId, displayId, key, min, max, getMaxFn) {
    const minusBtn  = document.getElementById(minusId);
    const plusBtn   = document.getElementById(plusId);
    const display   = document.getElementById(displayId);

    function update() {
        const effectiveMax = getMaxFn ? getMaxFn() : max;
        settings[key] = Math.max(min, Math.min(settings[key], effectiveMax));
        display.textContent = settings[key];

        // Enforce valid starting_player after players change
        if (key === "player_count") {
            if (settings.starting_player > settings.player_count) {
                settings.starting_player = settings.player_count;
                document.getElementById("starting-display").textContent = settings.starting_player;
            }
            if (settings.imposter_count >= settings.player_count) {
                settings.imposter_count = settings.player_count - 1;
                document.getElementById("imposters-display").textContent = settings.imposter_count;
            }
        }
    }

    minusBtn.addEventListener("click", () => {
        settings[key]--;
        update();
    });
    plusBtn.addEventListener("click", () => {
        settings[key]++;
        update();
    });
}

bindStepper("players-minus",  "players-plus",  "players-display",  "player_count",    2, 12);
bindStepper("imposters-minus","imposters-plus", "imposters-display","imposter_count",  1, 6,
    () => settings.player_count - 1);
bindStepper("starting-minus", "starting-plus",  "starting-display", "starting_player", 1, 12,
    () => settings.player_count);

// ---------- Pill groups ----------
function bindPillGroup(groupId, key, onChangeFn) {
    const group = document.getElementById(groupId);
    group.querySelectorAll(".pill").forEach(pill => {
        pill.addEventListener("click", () => {
            group.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            settings[key] = pill.dataset.value;
            if (onChangeFn) onChangeFn(pill.dataset.value);
        });
    });
}

bindPillGroup("mode-group",       "mode", (val) => {
    // Hide difficulty if classic mode (imposter has no word)
    const diffRow = document.getElementById("difficulty-row");
    diffRow.style.opacity  = val === "classic" ? "0.3" : "1";
    diffRow.style.pointerEvents = val === "classic" ? "none" : "auto";
});
bindPillGroup("difficulty-group", "difficulty");

// ---------- Start Game ----------
document.getElementById("start-btn").addEventListener("click", startGame);

async function startGame() {
    showScreen("loading");

    try {
        const response = await fetch("/start-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_count:    settings.player_count,
                imposter_count:  settings.imposter_count,
                mode:            settings.mode,
                difficulty:      settings.difficulty,
                starting_player: settings.starting_player
            })
        });

        gameData = await response.json();
        currentPlayerIndex = 0;

        showPassScreen();

    } catch (err) {
        console.error("Failed to start game:", err);
        // Fall back to setup on error
        showScreen("setup");
    }
}

// ---------- Pass Screen ----------
function showPassScreen() {
    const player = gameData.players[currentPlayerIndex];
    const total  = gameData.players.length;

    document.getElementById("pass-player-badge").textContent = `Player-${player.player}`;
    document.getElementById("round-indicator").textContent   = `${currentPlayerIndex + 1} / ${total}`;

    showScreen("pass");
}

document.getElementById("reveal-btn").addEventListener("click", showWordScreen);

// ---------- Word Screen ----------
function showWordScreen() {
    const player = gameData.players[currentPlayerIndex];

    document.getElementById("word-player-badge").textContent = `Player-${player.player}`;
    document.getElementById("word-display").textContent      = player.word.toUpperCase();

    showScreen("word");
}

document.getElementById("hide-btn").addEventListener("click", () => {
    currentPlayerIndex++;

    if (currentPlayerIndex >= gameData.players.length) {
        showScreen("discuss");
    } else {
        showPassScreen();
    }
});

// ---------- Discuss → Reveal ----------
document.getElementById("reveal-imposter-btn").addEventListener("click", showRevealScreen);

function showRevealScreen() {
    const imposterIds  = gameData.imposter_ids;
    const plural       = imposterIds.length > 1 ? "S" : "";

    document.getElementById("main-word-display").textContent     = gameData.main_word.toUpperCase();
    document.getElementById("imposter-word-display").textContent = gameData.imposter_word.toUpperCase();
    document.getElementById("imposter-plural").textContent       = plural;
    document.getElementById("imposters-display").textContent     =
        imposterIds.map(id => `P${id}`).join("  ·  ");

    showScreen("reveal");
}

// ---------- Play Again ----------
document.getElementById("play-again-btn").addEventListener("click", () => {
    showScreen("setup");
});

// ---------- Init ----------
initTheme();