import { describe, expect, it } from "vitest";
import { parseConfig } from "@/lib/config";

const K = (c: string) => "0x" + c.repeat(64);

describe("parseConfig", () => {
  it("defaults to memory mode with dev PINs and demo PINs visible", () => {
    const c = parseConfig({});
    expect(c.source).toBe("memory");
    expect(c.centrePins.get("DEMO-RAMPUR-1")).toBe("1111");
    expect(c.showDemoPins).toBe(true);
  });
  it("arkiv mode requires all keys", () => {
    expect(() => parseConfig({ DATA_SOURCE: "arkiv", CENTRE_PINS: "1111,2222,3333" })).toThrow(/ADMIN_KEY/);
  });
  it("arkiv mode maps centre keys in CENTRES order", () => {
    const c = parseConfig({
      DATA_SOURCE: "arkiv", ADMIN_KEY: K("a"), PAYER_KEY: K("b"), CENTRE_KEYS: [K("1"), K("2"), K("3")].join(","), CENTRE_PINS: "1111,2222,3333",
    });
    expect(c.centreKeys.get("DEMO-SONPUR-CHC")).toBe(K("2"));
    expect(c.showDemoPins).toBe(false);
  });
  it("rejects malformed keys, wrong counts and weak PINs", () => {
    const base = { DATA_SOURCE: "arkiv", ADMIN_KEY: K("a"), PAYER_KEY: K("b"), CENTRE_PINS: "1111,2222,3333" };
    expect(() => parseConfig({ ...base, CENTRE_KEYS: "0x12,0x34,0x56" })).toThrow();
    expect(() => parseConfig({ ...base, CENTRE_KEYS: K("1") })).toThrow(/count/);
    expect(() => parseConfig({ CENTRE_PINS: "12,2222,3333" })).toThrow(/digits/);
  });
  it("requires SESSION_SECRET in production arkiv mode", () => {
    expect(() => parseConfig({
      NODE_ENV: "production", DATA_SOURCE: "arkiv", ADMIN_KEY: K("a"), PAYER_KEY: K("b"), CENTRE_KEYS: [K("1"), K("2"), K("3")].join(","), CENTRE_PINS: "1111,2222,3333",
    })).toThrow(/SESSION_SECRET/);
  });
});
