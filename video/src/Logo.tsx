import { AbsoluteFill } from "remotion";
import { C, deva, serif } from "./theme";

export type LogoLayout = "mark" | "lockup";
export type LogoTheme = "dark" | "light";

const PALETTE = {
  dark: { bg: C.bg, ink: C.ink, accent: C.teal },
  light: { bg: "#f4f1ea", ink: "#16181d", accent: "#0f766e" },
};

function Vial({ ink, cap, height }: { ink: string; cap: string; height: number }) {
  const width = Math.round(height * 0.62);
  return (
    <svg width={width} height={height} viewBox="0 0 62 100" fill="none">
      <rect x="17" y="3" width="28" height="11" rx="2.5" fill={cap} />
      <path
        d="M25 15v8L15 35v50a12 12 0 0 0 12 12h8a12 12 0 0 0 12-12V35L37 23v-8"
        stroke={ink}
        strokeWidth="3.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ layout = "mark", theme = "dark" }: { layout?: LogoLayout; theme?: LogoTheme }) {
  const { bg, ink, accent } = PALETTE[theme];
  const mark = layout === "mark";
  return (
    <AbsoluteFill style={{ backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: mark ? "column" : "row", alignItems: "center", gap: mark ? 36 : 48 }}>
        <Vial ink={ink} cap={accent} height={mark ? 620 : 250} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: mark ? "center" : "flex-start", gap: mark ? 8 : 4 }}>
          <div style={{ fontFamily: serif, fontSize: mark ? 128 : 108, color: ink, letterSpacing: "-0.03em", lineHeight: 1 }}>JeevanStock</div>
          <div style={{ fontFamily: deva, fontWeight: 500, fontSize: mark ? 58 : 48, color: accent, letterSpacing: "0.01em" }}>जीवनस्टॉक</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
