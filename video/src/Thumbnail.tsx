import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { CLIPS } from "./clips";
import { Browser, Clip, Glow, Grain, Phone, Still, Vignette } from "./kit";
import { C, deva, mono, sans, serif } from "./theme";

export type ThumbVariant = "night" | "gap" | "product";

const Mark = () => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
    <span style={{ fontFamily: serif, fontSize: 64, color: C.ink, letterSpacing: "-0.02em" }}>JeevanStock</span>
    <span style={{ fontFamily: deva, fontSize: 46, fontWeight: 500, color: C.teal }}>जीवनस्टॉक</span>
  </div>
);

const Tag = ({ children, color = C.amber }: { children: ReactNode; color?: string }) => (
  <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 500, color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{children}</div>
);

const Left = ({ children }: { children: ReactNode }) => (
  <AbsoluteFill style={{ padding: "96px 110px", justifyContent: "space-between" }}>{children}</AbsoluteFill>
);

const Shade = () => <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,15,0.92) 0%, rgba(7,9,15,0.6) 45%, rgba(7,9,15,0) 75%)" }} />;

function Night() {
  return (
    <>
      <Still src="night-road.png" from={1.0} to={1.0} x={[420, 420]} dim={0.05} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,15,0.9) 0%, rgba(7,9,15,0.55) 40%, rgba(7,9,15,0) 62%)" }} />
      <Left>
        <Tag>Snakebite · 2 am · No anti-venom</Tag>
        <div style={{ fontFamily: serif, fontSize: 200, lineHeight: 0.95, color: C.ink, letterSpacing: "-0.03em", maxWidth: 1100 }}>
          Is the <span style={{ color: C.amber, fontStyle: "italic", whiteSpace: "nowrap" }}>anti‑venom</span> there?
        </div>
        <Mark />
      </Left>
    </>
  );
}

function Gap() {
  return (
    <>
      <Still src="warehouse.png" from={1.05} to={1.05} dim={0.35} />
      <Shade />
      <Left>
        <Tag>22 of 45 centres got none</Tag>
        <div>
          <div style={{ fontFamily: serif, fontSize: 380, lineHeight: 0.85, color: C.amber, letterSpacing: "-0.04em" }}>3,867</div>
          <div style={{ fontFamily: sans, fontSize: 86, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", marginTop: 20 }}>vials in stock. Nobody knew.</div>
        </div>
        <Mark />
      </Left>
    </>
  );
}

function Product() {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Glow color={C.teal} x="74%" y="45%" opacity={0.28} />
      <Glow color={C.amber} x="10%" y="95%" opacity={0.12} />
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", paddingRight: 150 }}>
        <div style={{ transform: "rotate(-4deg)" }}>
          <Phone height={940}>
            <Clip src={CLIPS.family.file} start={CLIPS.family.board + 1} />
          </Phone>
        </div>
      </AbsoluteFill>
      <Left>
        <Tag color={C.teal}>Live · India · Arkiv</Tag>
        <div style={{ fontFamily: serif, fontSize: 200, lineHeight: 0.92, color: C.ink, letterSpacing: "-0.03em", maxWidth: 1000 }}>
          Know <span style={{ fontStyle: "italic", color: C.teal }}>before</span> you go.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontFamily: sans, fontSize: 44, fontWeight: 500, color: C.ink, opacity: 0.85 }}>Anti-venom & rabies vaccine stock</div>
          <Mark />
        </div>
      </Left>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
}

export function Cover() {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Glow color={C.teal} x="72%" y="42%" opacity={0.3} />
      <Glow color={C.amber} x="8%" y="100%" opacity={0.14} />
      <div style={{ position: "absolute", right: -170, top: 170, transform: "perspective(2400px) rotateY(-14deg) rotateX(4deg)", transformOrigin: "right center" }}>
        <Browser width={1060} url="jeevan.batmnnn.live/dashboard">
          <Clip src={CLIPS.board.file} start={CLIPS.board.top + 3} />
        </Browser>
      </div>
      <div style={{ position: "absolute", right: 620, top: 230, transform: "rotate(-3deg)" }}>
        <Phone height={760}>
          <Clip src={CLIPS.family.file} start={CLIPS.family.centre + 1} />
        </Phone>
      </div>
      <AbsoluteFill style={{ padding: "110px 120px", justifyContent: "space-between", width: 980 }}>
        <Tag color={C.teal}>Live on Arkiv · India</Tag>
        <div>
          <div style={{ fontFamily: serif, fontSize: 168, lineHeight: 0.95, color: C.ink, letterSpacing: "-0.03em" }}>JeevanStock</div>
          <div style={{ fontFamily: deva, fontSize: 92, fontWeight: 500, color: C.teal, marginTop: 6 }}>जीवनस्टॉक</div>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 84, color: C.amber, marginTop: 36 }}>Know before you go.</div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 38, fontWeight: 500, lineHeight: 1.35, color: C.ink, opacity: 0.85, maxWidth: 600 }}>
          Public anti-venom & rabies vaccine stock for rural health centres. Hindi first.
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
}

export function Thumbnail({ variant }: { variant: ThumbVariant }) {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {variant === "night" ? <Night /> : variant === "gap" ? <Gap /> : <Product />}
    </AbsoluteFill>
  );
}
