/** Quiet sky behind the public board. Decorative only, and it fades before the numbers. */
export function BoardScene() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[26rem] overflow-hidden">
      <img src="/art/board-sky.jpg" alt="" width={1280} height={720} className="h-full w-full object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#eef2ff]" />
    </div>
  );
}
