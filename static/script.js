const startBtn = document.getElementById("start-btn");
const output = document.getElementById("output");


startBtn.addEventListener("click", async () => {

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
            starting_player: 2
        })
    });

    const data = await response.json();

    console.log(data);

    output.textContent = JSON.stringify(data, null, 4);

});