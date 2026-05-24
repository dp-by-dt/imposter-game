from flask import Flask, request, jsonify, render_template
import json
import random

app = Flask(__name__)


# ---------- Helper functions ----------

def load_words():
    with open("words.json", "r") as file:
        words = json.load(file)

    return words #returns the whole into the route


def choose_main_word(words):
    return random.choice(words)


def choose_imposter_word(word_set, difficulty="random"):
    imposter_list = []

    #choose the imposter list according to difficulty
    if difficulty == "easy":
        imposter_list.extend(word_set["easy"])
    elif difficulty == "medium":
        imposter_list.extend(word_set["medium"])
    elif difficulty == "hard":
        imposter_list.extend(word_set["hard"])

    #if difficulty is "random" or the list is empty
    if (difficulty=="random") or (not imposter_list):
        imposter_list.extend(word_set["easy"])
        imposter_list.extend(word_set["medium"])
        imposter_list.extend(word_set["hard"])

    #choose a random word from the list
    imposter_word = random.choice(imposter_list)
    return imposter_word


def choose_imposters(players, imposters):
    imposter_ids = random.sample(range(1,players+1), imposters)
    
    return imposter_ids


def build_players():
    pass


# ------------ Routes -------------


@app.route("/")
def home():
    return render_template("index.html")




@app.route("/start-game", methods=["POST"])
def start_game():

    #---------extract the frontend request data
    data = request.get_json()

    #---- WHILE DEBUGGING ONLY-- (FALL BACK)
    if data is None:
        data = {
            "player_count": 5,
            "imposter_count": 1,
            "mode": "related",
            "difficulty": "random",
            "starting_player": 2
        }

    player_count = data["player_count"]
    imposter_count = data["imposter_count"]
    mode = data["mode"]
    difficulty = data["difficulty"]
    starting_player = data["starting_player"]


    #----------get the current words set
    words = load_words()
    word_set = choose_main_word(words)
    main_word = word_set["main"]
    

    #choose imposter word
    #if mode is "chaos", we need to choose one
    if mode == "chaos":
        mode = random.choice(["related","classic"])


    if mode == "related":
        imposter_word = choose_imposter_word(word_set,difficulty)
    else:
        imposter_word = "Imposter"


    #--------- choose the imposter
    imposter_ids = choose_imposters(player_count,imposter_count)


    return jsonify({
        "mode": mode,
        "main_word": main_word,
        "imposter_word": imposter_word,
        "imposter_ids": imposter_ids
    })


# ---------- Main Loop ----------

if __name__ == "__main__":
    app.run(debug=True)