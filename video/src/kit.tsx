import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, mono, sans, serif } from "./theme";

const ease = Easing.bezier(...EASE);

export function useFadeIn(delay = 0, dur = 18) {
  const f = useCurrentFrame();
  return interpolate(f - delay, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
}

/** Scene wrapper: fades in over its first frames so overlapping Sequences cross-dissolve. */
export function Scene({ children, fade = 14 }: { children: ReactNode; fade?: number }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, fade], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, backgroundColor: C.bg }}>{children}</AbsoluteFill>;
}

/** Ken Burns still with a cinematic grade, vignette and grain. */
export function Still({ src, from = 1.12, to = 1.0, x = [0, 0], y = [0, 0], dim = 0.45, blur = 0 }: {
  src: string; from?: number; to?: number; x?: [number, number]; y?: [number, number]; dim?: number; blur?: number;
}) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const s = from + (to - from) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(`img/${src}`)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${s}) translate(${x[0] + (x[1] - x[0]) * t}px, ${y[0] + (y[1] - y[0]) * t}px)`,
          filter: `saturate(0.9) contrast(1.05) ${blur ? `blur(${blur}px)` : ""}`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(7,9,15,${dim * 0.6}) 0%, rgba(7,9,15,${dim * 0.25}) 40%, rgba(7,9,15,${Math.min(0.95, dim + 0.35)}) 100%)` }} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
}

export function Vignette() {
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />;
}

export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const f = useCurrentFrame();
  const seed = Math.floor(random(`g${Math.floor(f / 2)}`) * 100);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`n${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#n${seed})`} />
      </svg>
    </AbsoluteFill>
  );
}

/** Words rise from a soft blur, staggered. */
export function Rise({ text, delay = 0, stagger = 3, size = 96, color = C.ink, font = serif, weight = 400, style, italic }: {
  text: string; delay?: number; stagger?: number; size?: number; color?: string; font?: string; weight?: number; style?: CSSProperties; italic?: boolean;
}) {
  const f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: font, fontSize: size, lineHeight: 1.05, color, fontWeight: weight, letterSpacing: font === serif ? "-0.01em" : "-0.02em", fontStyle: italic ? "italic" : "normal", ...style }}>
      {words.map((w, i) => {
        const p = interpolate(f - delay - i * stagger, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 0.35}em)`, filter: `blur(${(1 - p) * 10}px)`, marginRight: "0.24em" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

export function Kicker({ children, delay = 0, color = C.amber }: { children: ReactNode; delay?: number; color?: string }) {
  const o = useFadeIn(delay, 16);
  return (
    <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color, opacity: o, display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ width: 36 * o, height: 2, background: color, display: "inline-block" }} />
      {children}
    </div>
  );
}

export function Caption({ text, bottom = 64 }: { text: string; bottom?: number }) {
  const o = useFadeIn(4, 10);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom, pointerEvents: "none" }}>
      <div style={{ opacity: o * 0.92, fontFamily: sans, fontSize: 30, color: C.ink, background: "rgba(7,9,15,0.62)", padding: "10px 22px", borderRadius: 12, maxWidth: 1400, textAlign: "center", backdropFilter: "blur(8px)" }}>
        {text}
      </div>
    </AbsoluteFill>
  );
}

export function CountUp({ to, delay = 0, dur = 40, format = (n: number) => Math.round(n).toLocaleString("en-IN") }: { to: number; delay?: number; dur?: number; format?: (n: number) => string }) {
  const f = useCurrentFrame();
  const v = interpolate(f - delay, [0, dur], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <>{format(v)}</>;
}

export function Waffle({ total, none, delay = 0, size = 34, cols = 15 }: { total: number; none: number; delay?: number; size?: number; cols?: number }) {
  const f = useCurrentFrame();
  const got = total - none;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.38 }}>
      {Array.from({ length: total }, (_, i) => {
        const p = interpolate(f - delay - i * 0.9, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        const filled = i < got;
        return (
          <div key={i} style={{
            width: size, height: size, borderRadius: "50%", opacity: p, transform: `scale(${0.6 + 0.4 * p})`,
            background: filled ? C.teal : "transparent", border: filled ? "none" : `3px solid ${C.red}`, boxSizing: "border-box",
          }} />
        );
      })}
    </div>
  );
}

export function Clip({ src, start = 0, style }: { src: string; start?: number; style?: CSSProperties }) {
  const { fps } = useVideoConfig();
  return <OffthreadVideo src={staticFile(`clips/${src}`)} startFrom={Math.round(start * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
}

export function Phone({ children, height = 900 }: { children: ReactNode; height?: number }) {
  const w = Math.round((height * 780) / 1688);
  const pad = 14;
  return (
    <div style={{ width: w + pad * 2, height: height + pad * 2, borderRadius: 64, padding: pad, background: "linear-gradient(145deg,#2a2d35,#0d0f14)", boxShadow: "0 60px 120px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.08) inset" }}>
      <div style={{ width: w, height, borderRadius: 52, overflow: "hidden", background: "#000", position: "relative" }}>{children}</div>
    </div>
  );
}

export function Browser({ children, width = 1240, url }: { children: ReactNode; width?: number; url: string }) {
  const h = Math.round((width * 900) / 1440);
  return (
    <div style={{ width, borderRadius: 18, overflow: "hidden", background: "#11141b", boxShadow: "0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)" }}>
      <div style={{ height: 46, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "#161a22" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }} />)}
        <div style={{ marginLeft: 18, flex: 1, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", color: C.dim, fontFamily: sans, fontSize: 16, display: "flex", alignItems: "center", paddingLeft: 14 }}>
          {url}
        </div>
      </div>
      <div style={{ width, height: h, position: "relative" }}>{children}</div>
    </div>
  );
}

export function Glow({ color = C.teal, x = "70%", y = "40%", opacity = 0.18 }: { color?: string; x?: string; y?: string; opacity?: number }) {
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent 45%)`, opacity }} />;
}
