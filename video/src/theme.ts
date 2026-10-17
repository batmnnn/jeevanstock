import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadDeva } from "@remotion/google-fonts/NotoSansDevanagari";
import durations from "./durations.json";

export const serif = loadSerif("normal", { subsets: ["latin"] }).fontFamily;
export const sans = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
export const deva = loadDeva("normal", { weights: ["400", "500"], subsets: ["devanagari"] }).fontFamily;

export const C = {
  bg: "#07090f",
  ink: "#f3efe6",
  dim: "rgba(243,239,230,0.62)",
  faint: "rgba(243,239,230,0.14)",
  teal: "#2dd4bf",
  amber: "#f5b400",
  red: "#f43f5e",
};

export const FPS = 30;
export const EASE = [0.16, 1, 0.3, 1] as const;

export const vo = (id: string): number => (durations as Record<string, number>)[id] ?? 4;
export const frames = (sec: number) => Math.round(sec * FPS);
