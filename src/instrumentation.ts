export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { config } = await import("./lib/config");
  config();
}
