import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { join } from "node:path";

const [id, ...framesArg] = process.argv.slice(2);
const browserExecutable = process.env.CHROME;
const serveUrl = await bundle({ entryPoint: join(process.cwd(), "src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of framesArg.map(Number)) {
  await renderStill({ serveUrl, composition, frame: f, output: `out/${id}-${f}.jpg`, imageFormat: "jpeg", scale: 0.5, browserExecutable });
  console.log("frame", f);
}
