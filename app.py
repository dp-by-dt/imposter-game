from flask import Flask, request, jsonify
import json
import random

app = Flask(__name__)


# ---------- Helper functions ----------

def load_words():
    with open("word.json","r") as file:
        #generate a random number
        x = random.randint(0,len(file))

        #load only the specific set from the words list
        word_set = json.load(file[x])
        return word_set


def choose_main_word():
    pass


def choose_imposter_word(word_set, difficulty="random"):
    imposter_list = []

    #choose the imposter list according to difficulty
    if difficulty == "easy":
        imposter_list.append(word_set["easy"])
    elif difficulty == "medium":
        imposter_list.append(word_set["medium"])
    elif difficulty == "medium":
        imposter_list.append(word_set["hard"])

    #if difficulty is "random" or the list is empty
    if len(imposter_list)<2:
        imposter_list.append(word_set["easy"])
        imposter_list.append(word_set["medium"])
        imposter_list.append(word_set["hard"])

    #choose a random word from the list
    imposter_word = random.choice(imposter_list)
    return imposter_word


def choose_imposters(players, imposters):
    imposter_ids = random.sample(range(0,players+1), imposters)
    
    return imposter_ids


def build_players():
    pass


# ------------ Routes -------------

@app.route("/start-game", methods=["POST","GET"])
def start_game():

    #----------get the current words set
    words_data = request.get_json(load_words())
    print(words_data)

    #-----------choose main word
    main_word = words_data["main"]

    #choose imposter word
    #if mode is "chaos", we need to choose one
    if mode == "chaos":
        mode = random.choice(["related","classic"])


    if mode == "related":
        imposter_word = choose_imposter_word(words_data,difficulty)
    else:
        imposter_word == "Imposter"


    #--------- choose the imposter
    imposter_ids = choose_imposters(player_count,imposter_count)


    return jsonify({
        "player_count": 5,
        "imposter_count": 1,
        "mode": "related",
        "difficulty": "random",
        "starting_player": 2
    })


# ---------- Main Loop ----------

if __name__ == "__main__":
    app.run(debug=True)