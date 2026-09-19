import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/Interfaces/user/User";
import { JwtService } from "@/services/JwtService.ts";
import {UserService, userService} from "@/services/UserService.ts";
import { authService } from "@/services/AuthService.ts";
import { gameSessionService } from "@/services/GameSessionService.ts";
import { GameMode } from "@/Interfaces/enums/GameMode.ts";
import { GameType } from "@/Interfaces/GameType.ts";

const GameSelect: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const token = JwtService.getToken();
        if (!token || JwtService.isTokenExpired(token)) {
          navigate("/login");
          return;
        }

        const keycloakId = JwtService.getKeycloakId();
        if (keycloakId) {
          const userData: User = await userService.getCurrentUser(keycloakId);
          setUser(userData);
        } else {
          setUser({
            username: "Guest",
            points: 0,
            id: "",
            keycloakId: "",
            emailAddress: "",
            role: "USER",
            isActive: true,
          } as User);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser({
          username: "Guest",
          points: 0,
          id: "",
          keycloakId: "",
          emailAddress: "",
          role: "USER",
          isActive: true,
        } as User);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const gameTypes: GameType[] = [
    {
      title: "RPG mode",
      description: "Chess with armies, gold and abilities. Build a force, fight AI-generated enemy armies, keep what survives.",
      icon: <span aria-hidden="true">♜</span>,
      comingSoon: false,
      path: "/rpg",
      isRanked: false,
      mode: "SINGLE_PLAYER_RPG" as GameMode,
    },
    {
      title: "Play the computer",
      description: "Standard chess against Stockfish at a rating you choose. No rating change.",
      icon: <span aria-hidden="true">♙</span>,
      comingSoon: false,
      path: "/bot-select",
      isRanked: false,
      mode: "CLASSIC_SINGLE_PLAYER" as GameMode,
    },
    {
      title: "Ranked match",
      description: "Live game against another player over WebSocket. Timers, spectators, rating on the line.",
      icon: <span aria-hidden="true">♔</span>,
      comingSoon: false,
      path: "/lobby",
      isRanked: true,
      mode: "CLASSIC_MULTIPLAYER" as GameMode,
    },
  ];

  const handleSelectGame = async (
    path: string,
    comingSoon: boolean,
    isRanked: boolean,
    mode: GameMode
  ): Promise<void> => {
    if (comingSoon) return;

    if (!user || !authService.isLoggedIn()) {
      toast({ title: "Error", description: "Please log in to start a game.", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (path === "/bot-select") {
      navigate(path, { state: { user, isRanked, mode } });
    } else if (path === "/lobby") {
      navigate(path, { state: { user, isRanked, mode } });
    } else {
      try {
        const session = await gameSessionService.createGameSession(user.id, mode, isRanked);
        navigate(path, { state: { isRankedMatch: isRanked, gameId: session.gameId, playerId: user.id } });
      } catch (error) {
        toast({ title: "Error", description: "Failed to create game session.", variant: "destructive" });
        console.error("Game session creation failed:", error);
      }
    }
  };

  const handleLogout = (): void => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="label mb-2">Play</p>
            <h1 className="text-3xl md:text-4xl">Pick a game</h1>
          </div>
          <dl className="flex gap-8 text-sm">
            <div>
              <dt className="label">Player</dt>
              <dd className="mt-1">{user?.username || "Guest"}</dd>
            </div>
            <div>
              <dt className="label">Rating</dt>
              <dd className="mt-1 num text-lg leading-tight">{user?.points ?? 0}</dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameTypes.map((game) => (
            <button
              key={game.title}
              type="button"
              disabled={game.comingSoon}
              onClick={() => handleSelectGame(game.path, game.comingSoon, game.isRanked, game.mode)}
              className="group text-left border border-border rounded-md p-5 bg-card hover:border-primary/60 transition-colors disabled:opacity-50 flex flex-col gap-4 min-h-[13rem]"
            >
              <span className="font-display text-4xl leading-none text-primary" aria-hidden="true">
                {game.icon}
              </span>
              <span className="flex-1">
                <span className="block font-display text-xl mb-1">{game.title}</span>
                <span className="block text-sm text-muted-foreground leading-relaxed">{game.description}</span>
              </span>
              <span className="text-sm text-primary group-hover:underline underline-offset-4">
                {game.comingSoon ? "Coming soon" : game.isRanked ? "Find a match →" : "Start →"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
          <button type="button" onClick={() => navigate("/profile")} className="hover:text-foreground">Profile</button>
          <button type="button" onClick={() => navigate("/leaderboard")} className="hover:text-foreground">Leaderboard</button>
          <button type="button" onClick={handleLogout} className="hover:text-foreground ml-auto">Sign out</button>
        </div>
      </div>
    </div>
  );
};

export default GameSelect;
