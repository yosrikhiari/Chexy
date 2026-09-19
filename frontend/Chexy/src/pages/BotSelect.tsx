import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/Interfaces/user/User";
import { JwtService } from "@/services/JwtService.ts";
import { userService } from "@/services/UserService.ts";
import { gameSessionService } from "@/services/GameSessionService.ts";
import { GameMode } from "@/Interfaces/enums/GameMode.ts";
import { AIStrategy } from "@/Interfaces/enums/AIStrategy.ts";
import { getDifficultyConfig, AI_DIFFICULTY_MAP } from "@/utils/AIDifficultyMapper.ts";

const BotSelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIStrategy | null>(null);

  const { user: locationUser, isRanked, mode } = location.state || {};

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
        } else if (locationUser) {
          setUser(locationUser);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (locationUser) {
          setUser(locationUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, locationUser]);

  // Get all difficulty levels sorted by points
  const difficultyLevels = Object.entries(AI_DIFFICULTY_MAP)
    .filter(([key]) => ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster'].includes(key))
    .sort(([, a], [, b]) => a.points - b.points)
    .map(([key, config]) => ({
      strategy: key as AIStrategy,
      ...config
    }));

  const handleSelectBot = async (strategy: AIStrategy) => {
    if (!user) {
      toast({ title: "Error", description: "User data not found.", variant: "destructive" });
      return;
    }

    setSelectedDifficulty(strategy);

    try {
      const session = await gameSessionService.createGameSession(
        user.id,
        mode || "CLASSIC_SINGLE_PLAYER",
        isRanked || false
      );
      navigate("/", { 
        state: { 
          isRankedMatch: isRanked, 
          gameId: session.gameId, 
          playerId: user.id,
          mode: mode || "CLASSIC_SINGLE_PLAYER",
          aiStrategy: strategy
        } 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create game session.", variant: "destructive" });
      console.error("Game session creation failed:", error);
      setSelectedDifficulty(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  const tier = (points: number) =>
    points <= 600 ? "Beginner" : points <= 800 ? "Intermediate" : points <= 1200 ? "Advanced" : points <= 1800 ? "Expert" : "Engine";

  return (
    <div className="h-full p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <p className="label mb-2">Play vs computer</p>
        <h1 className="text-3xl md:text-4xl mb-2">Choose an opponent</h1>
        <p className="text-muted-foreground mb-8 max-w-prose">
          Every level is Stockfish, throttled to a rating. The number is the strength you are playing against; pick the one just above your own.
        </p>

        <ol className="border border-border rounded-md divide-y divide-border">
          {difficultyLevels.map((bot) => {
            const config = getDifficultyConfig(bot.strategy);
            const isSelected = selectedDifficulty === bot.strategy;
            return (
              <li key={bot.strategy}>
                <button
                  type="button"
                  onClick={() => handleSelectBot(bot.strategy)}
                  disabled={isSelected}
                  aria-pressed={isSelected}
                  className={`w-full text-left grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[2.5rem_1fr_auto_auto] items-center gap-4 px-4 py-4 transition-colors ${
                    isSelected ? "bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <span className="font-display text-3xl leading-none text-primary text-center" aria-hidden="true">
                    {config.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{bot.name}</span>
                    <span className="block text-sm text-muted-foreground">{bot.description}</span>
                  </span>
                  <span className="hidden md:flex gap-1.5">
                    {bot.characteristics.slice(0, 2).map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                        {c}
                      </span>
                    ))}
                  </span>
                  <span className="text-right">
                    <span className="block num text-lg">{bot.points}</span>
                    <span className="block text-xs text-muted-foreground">{tier(bot.points)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Button variant="ghost" onClick={() => navigate("/game-select")} className="text-muted-foreground hover:text-foreground px-0">
            ← Back
          </Button>
          <span className="text-muted-foreground">
            {isRanked ? "Ranked — rating changes apply" : "Casual — no rating change"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BotSelect;
