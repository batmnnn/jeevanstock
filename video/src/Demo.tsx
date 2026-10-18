import type { ReactNode } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Browser, Caption, Clip, Glow, Grain, Kicker, Phone, Rise, Scene, Still, useFadeIn, Vignette } from "./kit";
import { C, deva, frames, mono, sans, serif, vo } from "./theme";
import { CLIPS } from "./clips";
import voText from "../vo.json";

const GAP = 0.55;
const OVERLAP = 10;
const LEAD = 6;
const text = (id: string) => voText.demo.find((l) => l.id === id)?.text ?? "";

type Device = { kind: "phone" | "browser"; clip: string; start: number; url?: string };
type Shot = { id: string; part?: string; title?: string; device?: Device; extra?: number; render?: () => ReactNode };

const SITE = "jeevan.batmnnn.live";
const F = CLIPS.family;
const S = CLIPS.staff;
const B = CLIPS.board;
const L = CLIPS.live;

const SHOTS: Shot[] = [
  { id: "d01", extra: 0.6, render: () => <Intro /> },
  { id: "d02", part: "01 · Family", title: "Hindi first. One tap to English.", device: { kind: "phone", clip: F.file, start: F.hindi } },
  { id: "d03", part: "01 · Family", title: "Stock first. Words, not only colours.", device: { kind: "phone", clip: F.file, start: F.board } },
  { id: "d04", part: "01 · Family", title: "Zero vials? Say so.", device: { kind: "phone", clip: F.file, start: F.centre } },
  { id: "d05", part: "01 · Family", title: "Two choices. No personal data.", device: { kind: "phone", clip: F.file, start: F.report } },
  { id: "d06", part: "01 · Family", title: "Written to Arkiv. No wallet, no fee.", device: { kind: "phone", clip: F.file, start: F.sent } },
  { id: "d07", part: "01 · Family", title: "A receipt with proof.", device: { kind: "phone", clip: F.file, start: F.receipt } },
  { id: "d08", part: "02 · Nurse", title: "Sign in with a PIN.", device: { kind: "browser", clip: S.file, start: S.login, url: `${SITE}/staff` } },
  { id: "d09", part: "02 · Nurse", title: "One batch. Both medicines.", device: { kind: "browser", clip: S.file, start: S.post, url: `${SITE}/staff/DEMO-RAMPUR-1` } },
  { id: "d10", part: "02 · Nurse", title: "Six-hour expiry.", device: { kind: "browser", clip: S.file, start: S.posted, url: `${SITE}/staff/DEMO-RAMPUR-1` } },
  { id: "d11", part: "02 · Nurse", title: "Confirm the report.", device: { kind: "browser", clip: S.file, start: S.inbox, url: `${SITE}/staff/DEMO-RAMPUR-1` } },
  { id: "d12", part: "03 · Public", title: "The public board.", device: { kind: "browser", clip: B.file, start: B.top, url: `${SITE}/dashboard` } },
  { id: "d13", part: "03 · Public", title: "Verify it yourself.", device: { kind: "browser", clip: B.file, start: B.verify, url: `${SITE}/dashboard` } },
  { id: "d14", part: "03 · Public", title: "Real centres. Real shipment data.", device: { kind: "phone", clip: L.file, start: L.list } },
  { id: "d15", extra: 2.2, render: () => <Outro /> },
];

function ShotView({ shot }: { shot: Shot }) {
  if (shot.render) return <>{shot.render()}</>;
  return <DeviceShot shot={shot} />;
}

function DeviceShot({ shot }: { shot: Shot }) {
  const f = useCurrentFrame();
  const p = useFadeIn(2, 22);
  const d = shot.device!;
  const phone = d.kind === "phone";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 75% 40%, #12202a 0%, ${C.bg} 60%)` }}>
      <Glow color={phone ? C.teal : C.amber} x={phone ? "72%" : "62%"} y="45%" opacity={0.1} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: phone ? "0 170px" : "0 80px", gap: phone ? 120 : 60 }}>
        <div style={{ width: phone ? 760 : 440, display: "flex", flexDirection: "column", gap: 26 }}>
          <Kicker color={shot.part?.startsWith("02") ? C.amber : C.teal}>{shot.part}</Kicker>
          <Rise text={shot.title ?? ""} size={phone ? 92 : 64} delay={4} stagger={2.5} />
        </div>
        <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40 + Math.sin(f / 45) * 4}px) scale(${0.97 + 0.03 * p})` }}>
          {phone ? (
            <Phone height={900}>
              <Clip src={d.clip} start={d.start} />
            </Phone>
          ) : (
            <Browser width={1300} url={d.url ?? SITE}>
              <Clip src={d.clip} start={d.start} />
            </Browser>
          )}
        </div>
      </AbsoluteFill>
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
}

function Intro() {
  return (
    <>
      <Still src="map-night.png" from={1.1} to={1.0} dim={0.65} />
      <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center", gap: 28 }}>
        <Kicker color={C.teal}>Product demo · live on Arkiv Tiramisu</Kicker>
        <Rise text="JeevanStock, end to end." size={140} delay={6} stagger={3} />
        <div style={{ display: "flex", gap: 18, opacity: useFadeIn(36) }}>
          {["A family after a bite", "The nurse at the centre", "Anyone, checking the record"].map((t, i) => (
            <span key={t} style={{ fontFamily: sans, fontSize: 28, color: C.ink, border: `1px solid ${C.faint}`, borderRadius: 999, padding: "10px 22px", background: "rgba(7,9,15,0.4)" }}>
              <span style={{ fontFamily: mono, color: [C.teal, C.amber, C.ink][i], marginRight: 12 }}>0{i + 1}</span>
              {t}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </>
  );
}

function Outro() {
  return (
    <>
      <Still src="dawn-hope.png" from={1.1} to={1.0} dim={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22 }}>
        <Rise text="JeevanStock" size={160} delay={2} stagger={0} style={{ textAlign: "center" }} />
        <div style={{ fontFamily: deva, fontSize: 44, color: C.dim, opacity: useFadeIn(10) }}>जीवन स्टॉक</div>
        <Rise text="Know before you go." size={68} delay={18} italic color={C.amber} style={{ textAlign: "center" }} />
        <div style={{ marginTop: 26, fontFamily: mono, fontSize: 26, color: C.ink, opacity: useFadeIn(34) }}>{SITE}</div>
        <div style={{ fontFamily: sans, fontSize: 22, color: C.dim, opacity: useFadeIn(44) }}>Staff demo PINs are on the demo page · github.com/batmnnn/jeevanstock</div>
      </AbsoluteFill>
      <Vignette />
    </>
  );
}

export function demoTimeline() {
  let at = 0;
  return SHOTS.map((s) => {
    const len = frames(vo(s.id) + GAP + (s.extra ?? 0)) + OVERLAP;
    const item = { ...s, from: at, len };
    at += len - OVERLAP;
    return item;
  });
}

export const demoFrames = () => {
  const t = demoTimeline();
  const last = t[t.length - 1];
  return last.from + last.len;
};

export function Demo({ captions = true }: { captions?: boolean }) {
  const t = demoTimeline();
  const total = demoFrames();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile("audio/bed.mp3")} startFrom={frames(70)} volume={(f) => interpolate(f, [0, 30, total - 60, total], [0, 0.22, 0.22, 0], { extrapolateRight: "clamp" })} />
      {t.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.len} name={s.id}>
          <Scene fade={OVERLAP}>
            <ShotView shot={s} />
          </Scene>
          {captions ? <Caption text={text(s.id)} bottom={40} /> : null}
          <Sequence from={LEAD}>
            <Audio src={staticFile(`audio/${s.id}.mp3`)} />
          </Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export { serif };
