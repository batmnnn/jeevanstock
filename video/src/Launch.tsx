import type { ReactNode } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Browser, Caption, Clip, CountUp, Glow, Grain, Kicker, Phone, Rise, Scene, Still, useFadeIn, Vignette, Waffle } from "./kit";
import { C, deva, frames, mono, sans, serif, vo } from "./theme";
import { CLIPS } from "./clips";
import voText from "../vo.json";

const GAP = 0.35;
const OVERLAP = 12;
const LEAD = 6;

const text = (id: string) => voText.launch.find((l) => l.id === id)?.text ?? "";

type Shot = { id: string; extra?: number; render: () => ReactNode };

const Pad = ({ children, align = "flex-end" as const }: { children: ReactNode; align?: "flex-end" | "center" | "flex-start" }) => (
  <AbsoluteFill style={{ padding: "120px 140px 170px", justifyContent: align, gap: 28 }}>{children}</AbsoluteFill>
);

const SHOTS: Shot[] = [
  {
    id: "l01",
    render: () => (
      <>
        <Still src="night-road.png" from={1.16} to={1.04} x={[-30, 10]} />
        <Pad>
          <Kicker>4 October 2026 · Panna</Kicker>
          <Rise text="A snakebite at 2 am." size={120} delay={8} />
        </Pad>
      </>
    ),
  },
  {
    id: "l02",
    render: () => (
      <>
        <Still src="phc-night.png" from={1.0} to={1.1} />
        <Pad>
          <Rise text="No anti-venom." size={140} delay={4} />
          <Rise text="She died on the way to the next centre." size={44} font={sans} color={C.dim} delay={22} stagger={2} />
        </Pad>
      </>
    ),
  },
  {
    id: "l03",
    render: () => (
      <>
        <Still src="map-night.png" from={1.05} to={1.18} dim={0.6} />
        <AbsoluteFill style={{ padding: "0 140px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 760 }}>
            <Kicker>Durg and Balod · since 1 April 2026</Kicker>
            <div style={{ fontFamily: serif, fontSize: 200, color: C.ink, lineHeight: 0.9 }}>
              <CountUp to={22} delay={6} dur={30} /> <span style={{ color: C.dim, fontSize: 110 }}>of 45</span>
            </div>
            <Rise text="rural health centres got no anti-venom." size={46} font={sans} color={C.ink} delay={20} stagger={2} />
            <div style={{ fontFamily: mono, fontSize: 20, color: C.dim, opacity: useFadeIn(40) }}>Source: CGMSCL issue register</div>
          </div>
          <Waffle total={45} none={22} delay={10} size={38} cols={9} />
        </AbsoluteFill>
      </>
    ),
  },
  {
    id: "l04",
    render: () => (
      <>
        <Still src="warehouse.png" from={1.2} to={1.04} />
        <Pad>
          <Kicker color={C.teal}>Durg warehouse · 17 October 2026</Kicker>
          <div style={{ fontFamily: serif, fontSize: 220, color: C.ink, lineHeight: 0.9 }}>
            <CountUp to={3867} delay={4} dur={45} />
          </div>
          <Rise text="anti-venom vials, ready to issue." size={50} font={sans} delay={16} stagger={2} />
        </Pad>
      </>
    ),
  },
  {
    id: "l05",
    render: () => (
      <>
        <Still src="empty-fridge.png" from={1.0} to={1.12} dim={0.55} />
        <Pad align="center">
          <Rise text="The medicine exists." size={130} delay={4} />
          <Rise text="The information doesn't." size={130} delay={70} color={C.amber} italic />
        </Pad>
      </>
    ),
  },
  { id: "l06", extra: 0.4, render: () => <Wordmark /> },
  {
    id: "l07",
    render: () => (
      <>
        <Still src="nurse-phone.png" from={1.1} to={1.0} dim={0.5} />
        <AbsoluteFill style={{ padding: "0 120px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 640 }}>
            <Kicker color={C.teal}>For the nurse</Kicker>
            <Rise text="A PIN." size={120} delay={4} />
            <Rise text="No wallet. No crypto." size={64} color={C.dim} delay={30} />
          </div>
          <Float delay={8}>
            <Browser width={980} url="jeevan.batmnnn.live/staff">
              <Clip src={CLIPS.staff.file} start={CLIPS.staff.post} />
            </Browser>
          </Float>
        </AbsoluteFill>
      </>
    ),
  },
  { id: "l08", render: () => <Expiry /> },
  {
    id: "l09",
    render: () => (
      <>
        <Still src="phone-hand.png" from={1.06} to={1.0} dim={0.65} blur={6} />
        <AbsoluteFill style={{ padding: "0 160px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 820 }}>
            <Kicker>For the family</Kicker>
            <Rise text="Who has it." size={110} delay={4} />
            <Rise text="Call ahead." size={110} delay={26} />
            <Rise text="Report in two taps." size={110} delay={48} color={C.amber} />
          </div>
          <Float delay={6}>
            <Phone height={860}>
              <Clip src={CLIPS.family.file} start={CLIPS.family.board} />
            </Phone>
          </Float>
        </AbsoluteFill>
      </>
    ),
  },
  {
    id: "l10",
    render: () => (
      <>
        <Still src="ledger-abstract.png" from={1.0} to={1.14} x={[0, -40]} dim={0.4} />
        <Pad>
          <Kicker color={C.teal}>On Arkiv</Kicker>
          <Rise text="Nobody can quietly change it." size={112} delay={6} />
          <Rise text="Not a centre. Not us." size={56} font={sans} color={C.dim} delay={44} />
          <div style={{ fontFamily: mono, fontSize: 22, color: C.teal, opacity: useFadeIn(30) * 0.9 }}>
            report 0x9771a72b… · readonly · creator = payer wallet · expires in 48 h
          </div>
        </Pad>
      </>
    ),
  },
  {
    id: "l11",
    render: () => (
      <>
        <Still src="village-dawn.png" from={1.14} to={1.02} />
        <Pad>
          <div style={{ fontFamily: deva, fontSize: 104, color: C.ink, opacity: useFadeIn(2, 20) }}>हिन्दी पहले।</div>
          <Rise text="Built for all of India. First pilot: Chhattisgarh." size={64} font={sans} delay={22} stagger={2} />
        </Pad>
      </>
    ),
  },
  { id: "l12", extra: 2.4, render: () => <EndCard /> },
];

function ShotView({ render }: { render: () => ReactNode }) {
  return <>{render()}</>;
}

function Float({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const f = useCurrentFrame();
  const p = useFadeIn(delay, 24);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 60 + Math.sin(f / 40) * 6}px)` }}>{children}</div>;
}

function Wordmark() {
  const f = useCurrentFrame();
  const line = interpolate(f, [10, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, alignItems: "center", justifyContent: "center", gap: 26 }}>
      <Glow color={C.teal} x="50%" y="50%" opacity={0.14} />
      <Rise text="JeevanStock" size={190} delay={2} stagger={0} style={{ textAlign: "center" }} />
      <div style={{ width: 520 * line, height: 2, background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)` }} />
      <div style={{ fontFamily: deva, fontSize: 48, color: C.dim, opacity: useFadeIn(18) }}>जीवन स्टॉक</div>
      <Rise text="A public stock board for anti-venom and rabies vaccine." size={40} font={sans} color={C.ink} delay={34} stagger={1.5} style={{ textAlign: "center", marginTop: 20 }} />
      <Grain />
    </AbsoluteFill>
  );
}

function Expiry() {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hours = 6 - 6 * p;
  const stale = p >= 1;
  const r = 150;
  const circ = 2 * Math.PI * r;
  return (
    <>
      <Still src="vials-macro.png" from={1.0} to={1.1} dim={0.35} />
      <AbsoluteFill style={{ padding: "0 140px", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 820 }}>
          <Kicker>Every count</Kicker>
          <Rise text="Expires in six hours." size={112} delay={4} />
          <Rise text="An old number never looks new." size={52} font={sans} color={C.dim} delay={30} stagger={2} />
        </div>
        <div style={{ position: "relative", width: 360, height: 360, opacity: useFadeIn(6) }}>
          <svg width={360} height={360} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={180} cy={180} r={r} stroke={C.faint} strokeWidth={10} fill="none" />
            <circle cx={180} cy={180} r={r} stroke={stale ? C.dim : C.teal} strokeWidth={10} fill="none" strokeDasharray={circ} strokeDashoffset={circ * p} strokeLinecap="round" />
          </svg>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontFamily: mono, fontSize: 64, color: C.ink }}>{hours.toFixed(1)} h</div>
            <div style={{ fontFamily: sans, fontSize: 26, fontWeight: 600, color: stale ? C.ink : C.bg, background: stale ? "rgba(243,239,230,0.18)" : C.teal, padding: "6px 18px", borderRadius: 999 }}>
              {stale ? "● Stale" : "● In stock · 8 vials"}
            </div>
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </>
  );
}

function EndCard() {
  return (
    <>
      <Still src="dawn-hope.png" from={1.1} to={1.0} dim={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22 }}>
        <Rise text="JeevanStock" size={170} delay={2} stagger={0} style={{ textAlign: "center" }} />
        <Rise text="Know before you go." size={72} delay={20} italic color={C.amber} style={{ textAlign: "center" }} />
        <div style={{ marginTop: 30, fontFamily: mono, fontSize: 26, color: C.ink, opacity: useFadeIn(40) }}>jeevan.batmnnn.live</div>
        <div style={{ fontFamily: sans, fontSize: 22, color: C.dim, opacity: useFadeIn(52) }}>Open source · Built on Arkiv · github.com/batmnnn/jeevanstock</div>
      </AbsoluteFill>
      <Vignette />
    </>
  );
}

export function launchTimeline() {
  let at = 0;
  return SHOTS.map((s) => {
    const len = frames(vo(s.id) + GAP + (s.extra ?? 0)) + OVERLAP;
    const item = { ...s, from: at, len };
    at += len - OVERLAP;
    return item;
  });
}

export const launchFrames = () => {
  const t = launchTimeline();
  const last = t[t.length - 1];
  return last.from + last.len;
};

export function Launch({ captions = true }: { captions?: boolean }) {
  const t = launchTimeline();
  const total = launchFrames();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile("audio/bed.mp3")} volume={(f) => interpolate(f, [0, 30, total - 60, total], [0, 0.32, 0.32, 0], { extrapolateRight: "clamp" })} />
      {t.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.len} name={s.id}>
          <Scene>
            <ShotView render={s.render} />
          </Scene>
          {captions ? <Caption text={text(s.id)} /> : null}
          <Sequence from={LEAD}>
            <Audio src={staticFile(`audio/${s.id}.mp3`)} />
          </Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
