/** Overlapping copies of the same tuft, at mixed sizes, so the ground can be arranged instead of stretched. */
const TUFTS = [
  { left: "-4%", box: "bottom-0 h-16 w-auto lg:h-24", flip: false },
  { left: "16%", box: "bottom-4 h-12 w-auto lg:h-16", flip: true },
  { left: "28%", box: "bottom-0 h-16 w-auto lg:h-28", flip: false },
  { left: "44%", box: "bottom-3 h-14 w-auto lg:h-20", flip: true },
  { left: "56%", box: "bottom-0 h-16 w-auto lg:h-24", flip: false },
  { left: "70%", box: "bottom-5 h-12 w-auto lg:h-16", flip: true },
  { left: "82%", box: "bottom-0 h-16 w-auto lg:h-28", flip: false },
  { left: "94%", box: "bottom-2 h-14 w-auto lg:h-20", flip: true },
] as const;

/** Full-page scenery. The landscape stays at the artwork's width; wider screens keep sky on the sides. */
export function HomeScene() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img src="/art/sky.jpg" alt="" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[80rem] -translate-x-1/2 overflow-hidden">
        <div className="absolute bottom-[20%] left-0 w-full [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_78%,transparent)] lg:bottom-[26%]">
          <img
            src="/art/hills.png"
            alt=""
            width={1280}
            height={251}
            className="w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          />
        </div>
        <img
          src="/art/trees.png"
          alt=""
          width={678}
          height={830}
          className="absolute bottom-0 left-0 h-56 w-auto lg:left-2 lg:h-72"
        />
        <img
          src="/art/clinic.png"
          alt=""
          width={903}
          height={551}
          className="absolute right-0 bottom-1 h-44 w-auto drop-shadow-[0_12px_16px_rgb(20_27_45/0.14)] lg:right-2 lg:h-60"
        />
        {TUFTS.map((tuft) => (
          <img
            key={tuft.left}
            src="/art/grass.png"
            alt=""
            width={1104}
            height={155}
            className={`absolute ${tuft.box} ${tuft.flip ? "-scale-x-100" : ""}`}
            style={{ left: tuft.left }}
          />
        ))}
      </div>
    </div>
  );
}
