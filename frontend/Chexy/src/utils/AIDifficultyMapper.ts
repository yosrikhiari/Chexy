import { AIStrategy } from "@/Interfaces/enums/AIStrategy";

export interface DifficultyConfig {
  points: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  characteristics: string[];
}

export const AI_DIFFICULTY_MAP: Record<AIStrategy, DifficultyConfig> = {
  // Legacy strategies (mapped to balanced difficulty)
  defensive: {
    points: 800,
    name: "Defensive",
    description: "Prefers solid positions and trades down.",
    icon: "♗",
    color: "blue",
    characteristics: ["Defensive play", "Cautious moves", "Solid position"]
  },
  aggressive: {
    points: 1200,
    name: "Aggressive",
    description: "Looks for tactics and keeps pieces active.",
    icon: "♘",
    color: "red",
    characteristics: ["Attacking play", "Tactical combinations", "Active pieces"]
  },
  balanced: {
    points: 1000,
    name: "Balanced",
    description: "Mixes positional and tactical play.",
    icon: "♖",
    color: "purple",
    characteristics: ["Mixed strategy", "Adaptive play", "Positional understanding"]
  },
  adaptive: {
    points: 1400,
    name: "Adaptive",
    description: "Adjusts its plan to the position on the board.",
    icon: "♕",
    color: "green",
    characteristics: ["Positional adaptation", "Dynamic play", "Strategic flexibility"]
  },

  // New detailed difficulty levels
  novice: {
    points: 400,
    name: "Novice",
    description: "Plays fast, blunders often. Good for learning the moves.",
    icon: "♙",
    color: "yellow",
    characteristics: ["Blunders often", "Fast moves"]
  },
  apprentice: {
    points: 600,
    name: "Apprentice",
    description: "Knows basic tactics; still drops pieces under pressure.",
    icon: "♙",
    color: "orange",
    characteristics: ["Basic tactics", "Drops pieces"]
  },
  journeyman: {
    points: 800,
    name: "Journeyman",
    description: "Sound fundamentals, occasional mistakes.",
    icon: "♗",
    color: "cyan",
    characteristics: ["Sound openings", "Some mistakes"]
  },
  expert: {
    points: 1200,
    name: "Expert",
    description: "Rarely blunders; plays with a plan.",
    icon: "♘",
    color: "blue",
    characteristics: ["Positional play", "Rare mistakes"]
  },
  master: {
    points: 1800,
    name: "Master",
    description: "Calculates deeply. Expect a long game.",
    icon: "♖",
    color: "purple",
    characteristics: ["Deep calculation", "Endgame technique"]
  },
  grandmaster: {
    points: 2400,
    name: "Grandmaster",
    description: "Full engine strength.",
    icon: "♔",
    color: "gold",
    characteristics: ["Engine strength", "No handicap"]
  }
};

export function getDifficultyConfig(strategy: AIStrategy): DifficultyConfig {
  return AI_DIFFICULTY_MAP[strategy];
}

export function getDifficultyPoints(strategy: AIStrategy): number {
  return AI_DIFFICULTY_MAP[strategy].points;
}

export function getDifficultyName(strategy: AIStrategy): string {
  return AI_DIFFICULTY_MAP[strategy].name;
}

export function getDifficultyDescription(strategy: AIStrategy): string {
  return AI_DIFFICULTY_MAP[strategy].description;
}

export function getDifficultyIcon(strategy: AIStrategy): string {
  return AI_DIFFICULTY_MAP[strategy].icon;
}

export function getDifficultyColor(strategy: AIStrategy): string {
  return AI_DIFFICULTY_MAP[strategy].color;
}

export function getDifficultyCharacteristics(strategy: AIStrategy): string[] {
  return AI_DIFFICULTY_MAP[strategy].characteristics;
}
