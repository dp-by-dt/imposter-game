from flask import Flask, request, jsonify
import json
import random

app = Flask(__name__)


# ---------- Helper functions ----------

def load_words():
    pass


def choose_main_word():
    pass


def choose_imposter_word():
    pass


def choose_imposters():
    pass


def build_players():
    pass


# ------------ Routes -------------

@app.route("/start-game", methods=["POST"])
def start_game():

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