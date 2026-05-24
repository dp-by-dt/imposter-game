# 1.0 Initial Setups

- folder created (`imposter-game/`)
- Git repo initialised (`git init`)
- Created conda environment (`conda create -n impostergame python=3.14`) & activated
- Initial folder structure done:
    imposter-game/
    │
    ├── app.py
    ├── requirements.txt
    ├── words.json
    ├── documentation.md
    │
    ├── templates/
    │   └── index.html
    │
    ├── static/
    │   ├── style.css
    │   └── script.js
    │
    └── .gitignore

- Flask installed in the environment (`pip install flask`) and requirements.txt created using freeze command
- Add the following to `.gitignore`:
    __pycache__/
    *.pyc
    .env
    .vscode/

- Created empty repo in github
- Connected it with the local git instance: `git remote add origin https://github.com/dpbydt/imposter-game.git`
- Initial commit and pushing done to the master branch



# 2.0 Flask route working
 - Dummy dataset created
 - The payload strcutre (front end to back) will be like:
    {
        "player_count": 5, #minimum: 3
        "imposter_count": 1, #minimum: 1, maximum: < player_count/2
        "mode": "related", #options: (classic, related,chaos)
        "difficulty": "random", #options: (easy,medium,hard,random)
        "starting_player": 2 #default: 1
    }

- The output structure (backend to front) will be like:
    {
        "game_mode": "related",
        "main_word": "Beach",
        "imposter_word": "Island",
        "imposter_indices": [3],

        "players": [
            {
                "player": 2,
                "word": "Beach"
            },
            {
                "player": 3,
                "word": "Island"
            },
            {
                "player": 4,
                "word": "Beach"
            },
            {
                "player": 5,
                "word": "Beach"
            },
            {
                "player": 1,
                "word": "Beach"
            }
        ]
    }

- Initial strucutre of `app.py` is written as the skeleton


Dummy JSON dataset
Generate game payload
Frontend fetch
Player iteration
Reveal/hide flow
Final reveal screen
localStorage settings
polish