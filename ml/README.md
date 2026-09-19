# Chexy — AI service

Python service that gives **Chexy** its opponents. One of four repositories:

| Repo | Role |
|---|---|
| [Chexy-B](https://github.com/yosrikhiari/Chexy-B) | Spring Boot API, realtime, Keycloak auth, MongoDB, Kafka |
| [Chexy-F](https://github.com/yosrikhiari/Chexy-F) | React 18 + Vite client |
| **Chexy-M** (this one) | Flask AI service |
| [Chexy-Deployment](https://github.com/yosrikhiari/Chexy-Deployment) | Kubernetes manifests + Jenkins pipeline |

## What it does

| Endpoint | What happens |
|---|---|
| `POST /api/classic/ai-move` | Asks **Stockfish** (via `python-chess`) for candidate moves and picks one according to the bot's skill: a bot with few points deliberately plays weaker moves (`get_weak_move`, `evaluate_move_quality`), a strong bot plays the engine's choice. |
| `POST /api/detect-opening` | Matches the current move list against an openings table (`Models/Openings/*.tsv`) and names the opening. |
| `POST /api/enemy-army` | Generates an enemy army for the RPG mode from the player's level and board size. |
| `GET /health` | Liveness. |

`RPG.py` holds the RPG-mode move logic (`RPGAIModel`): it enumerates legal moves on the RPG
board, scores each with positional, aggressive, defensive and special-ability bonuses, and
selects by difficulty.

## Stack

Python 3.10+, **Flask** + Flask-CORS, **python-chess**, a **Stockfish** binary, waitress for
serving. `Models/Dockerfile` builds the service image used by the deployment repo.

## Run

```bash
cd Models
python -m venv .venv && source .venv/bin/activate      # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
# make sure a Stockfish binary is on PATH (or set STOCKFISH_PATH in .env)
python app.py
```

## Layout

```
Models/
  app.py                  Flask app and endpoints
  RPG.py                  RPG-mode AI (RPGAIModel)
  opening_detector.py     opening detection over the TSV tables
  Openings/               a.tsv … e.tsv (ECO opening tables)
  requirements.txt, Dockerfile
```

Built as a side project (2025).
