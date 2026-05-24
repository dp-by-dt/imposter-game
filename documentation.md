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



Flask route working
Dummy JSON dataset
Generate game payload
Frontend fetch
Player iteration
Reveal/hide flow
Final reveal screen
localStorage settings
polish