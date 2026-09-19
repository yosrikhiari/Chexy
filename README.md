# Chexy

A chess platform with a classic mode and an RPG mode (armies, gold, special abilities), played
in realtime against friends or Stockfish-backed bots. Built at ESPRIT, June–October 2025.

This monorepo replaces four earlier repositories (Chexy-B, Chexy-F, Chexy-M, Chexy-Deployment);
each was imported with its full history via `git subtree`.

| Folder | What it is | Stack |
|---|---|---|
| [`backend/`](backend/) | API, realtime, auth, game orchestration | Java 17, Spring Boot 3.4, Keycloak, MongoDB, Kafka, RabbitMQ, WebSocket (STOMP) |
| [`frontend/`](frontend/) | Web client | React 18, TypeScript, Vite, Tailwind, chess.js, STOMP/SockJS |
| [`ml/`](ml/) | AI service: bot moves, opening detection, RPG enemy armies | Python, Flask, python-chess, Stockfish |
| [`deploy/`](deploy/) | Kubernetes manifests and the Jenkins pipeline that builds, pushes and deploys the four images | Kubernetes, Jenkins, Docker Hub |

## How the pieces talk

- The frontend calls the backend over REST and keeps boards, timers and chat live over a
  STOMP WebSocket.
- The backend authenticates through Keycloak (OAuth 2.0 / OIDC), stores game state in MongoDB,
  publishes game events to Kafka and uses RabbitMQ for messaging.
- For bot games and RPG enemies the backend calls the AI service (`ml/`), which asks Stockfish
  for candidate moves and picks one according to the bot's skill level.
- `deploy/Jenkinsfile` checks out this repository, builds the `backend`, `frontend`, `ml` and
  Keycloak images, pushes them to Docker Hub and applies `deploy/kubernetes/deployment.yaml`.

## Run locally

Each folder has its own README with setup and run instructions:
[backend](backend/README.md) · [frontend](frontend/README.md) · [ml](ml/README.md) · [deploy](deploy/README.md).
