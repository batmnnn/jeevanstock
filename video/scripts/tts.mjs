import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error("Set OPENAI_API_KEY");
const vo = JSON.parse(readFileSync(join(root, "vo.json"), "utf8"));
const outDir = join(root, "public", "audio");
mkdirSync(outDir, { recursive: true });
const force = process.argv.includes("--force");

async function speak(line) {
  const file = join(outDir, `${line.id}.mp3`);
  if (existsSync(file) && !force) return file;
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: vo.model, voice: vo.voice, input: line.text, instructions: vo.instructions, response_format: "mp3" }),
  });
  if (!res.ok) throw new Error(`${line.id}: ${res.status} ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const durations = {};
const lines = [...vo.launch, ...vo.demo];
for (let i = 0; i < lines.length; i += 6) {
  const batch = lines.slice(i, i + 6);
  const files = await Promise.all(batch.map(speak));
  batch.forEach((line, j) => {
    const sec = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", files[j]]).toString().trim());
    durations[line.id] = sec;
    console.log(line.id, sec.toFixed(2));
  });
}
writeFileSync(join(root, "src", "durations.json"), JSON.stringify(durations, null, 2));
