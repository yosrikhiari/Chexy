// Runtime endpoints. Override with VITE_* variables (see .env.example).
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";
export const AI_BASE_URL: string = import.meta.env.VITE_AI_BASE_URL ?? "http://localhost:5000";
