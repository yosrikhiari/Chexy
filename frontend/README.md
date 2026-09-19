# Chexy — Frontend

React client for **Chexy**, a chess platform with a classic mode and an RPG mode. Part of the [Chexy monorepo](https://github.com/yosrikhiari/Chexy):

| Folder | Role |
|---|---|
| `backend/` | Spring Boot 3.4 API, realtime, Keycloak auth, MongoDB, Kafka |
| `frontend/` | React 18 + Vite + TypeScript client |
| `ml/` | Flask AI service (Stockfish bots, opening detection, RPG enemy armies) |
| `deploy/` | Kubernetes manifests + Jenkins pipeline |

## What it does

- **Play** — classic chess against a friend or a bot (`GameSelect`, `BotSelect`, `Lobby`),
  realtime boards and timers over WebSocket, spectating.
- **RPG adventure** — the RPG mode UI (`RPGAdventure`): armies, gold, abilities, AI enemy
  armies from the AI service.
- **Social** — login / register / password reset (Keycloak-backed), profile, leaderboard,
  friends sidebar and chat.

## Stack

- **React 18, TypeScript, Vite**, Tailwind CSS, Radix UI, lucide icons
- **@tanstack/react-query** for server state, **react-router-dom** for routing
- **@stomp/stompjs + SockJS** for realtime (STOMP over WebSocket to the backend)
- **chess.js** for move validation on the client
- **nginx** image for serving the built app (`Chexy/Dockerfile`, `Chexy/nginx.conf`)

## Run

```bash
cd Chexy
cp .env.example .env        # VITE_API_BASE_URL → the backend
npm install
npm run dev                 # http://localhost:5173
```

Production image: `docker build -t chexy-frontend ./Chexy`.

## Layout

```
Chexy/
  src/pages/          Index, Login, Register, ForgotPassword, GameSelect, BotSelect, Lobby,
                      RPGAdventure, Leaderboard, Profile, NotFound
  src/components/     MainLayout, FriendsSidebar, ui/ (shared components)
  src/WebSocket/      STOMP client and subscriptions
  src/services/       API clients
  src/hooks/, src/lib/, src/utils/, src/Guard/ (route guards), src/Interfaces/
  Dockerfile, nginx.conf, vite.config.ts, tailwind.config.ts
```

Built as a side project (2025).
