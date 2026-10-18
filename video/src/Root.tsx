import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Demo, demoFrames } from "./Demo";
import { Launch, launchFrames } from "./Launch";
import { C, FPS } from "./theme";
import { Cover, Thumbnail, type ThumbVariant } from "./Thumbnail";
import { Logo, type LogoLayout, type LogoTheme } from "./Logo";

const BRIDGE = 15;

function Full() {
  const l = launchFrames();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence durationInFrames={l}>
        <Launch />
      </Sequence>
      <Sequence from={l + BRIDGE}>
        <Demo />
      </Sequence>
    </AbsoluteFill>
  );
}

export function Root() {
  const size = { width: 1920, height: 1080, fps: FPS };
  return (
    <>
      <Composition id="Launch" component={Launch} durationInFrames={launchFrames()} {...size} />
      <Composition id="Demo" component={Demo} durationInFrames={demoFrames()} {...size} />
      <Composition id="Full" component={Full} durationInFrames={launchFrames() + BRIDGE + demoFrames()} {...size} />
      <Composition id="Cover" component={Cover} durationInFrames={1} {...size} />
      <Composition id="LogoMark" component={Logo} durationInFrames={1} width={1024} height={1024} fps={FPS} defaultProps={{ layout: "mark" as LogoLayout, theme: "dark" as LogoTheme }} />
      <Composition id="LogoLockup" component={Logo} durationInFrames={1} width={1400} height={480} fps={FPS} defaultProps={{ layout: "lockup" as LogoLayout, theme: "dark" as LogoTheme }} />
      <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} {...size} defaultProps={{ variant: "night" as ThumbVariant }} />
    </>
  );
}
