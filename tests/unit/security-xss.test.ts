import { describe, expect, it } from "vitest";
import { safeQrSvg } from "@/lib/dashboard/svg";
import { posterOrigin } from "@/lib/dashboard/origin";
import { addressUrl, entityUrl, EXPLORER, txUrl } from "@/lib/explorer";
import { decodeAck, decodeCentre } from "@/lib/repo/decode";

const cell = (type: string, value: unknown) => ({ type, value });
const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));
const W = "0x" + "c0".repeat(20);

function centre(over: { name?: unknown; district?: string; state?: string } = {}) {
  return decodeCentre({
    key: "0x" + "ab".repeat(32),
    creator: W,
    createdAt: 10n,
    expiresAt: 20n,
    attributes: {
      centreId: cell("str", "DEMO-A"),
      district: cell("str", over.district ?? "Demo District"),
      state: cell("str", over.state ?? "MP"),
      wallet: cell("addr", W),
    },
    payload: enc({ name: over.name ?? "Demo PHC", lat: 24.1, lon: 80.1, phone: "9999999999" }),
  });
}

describe("chain text", () => {
  it("keeps markup as text and drops the phone from the payload", () => {
    const row = centre({ name: "<script>alert(1)</script>" });
    expect(row?.name).toBe("<script>alert(1)</script>");
    expect(JSON.stringify(row)).not.toContain("9999999999");
  });

  it("strips control characters and caps long labels", () => {
    const row = centre({ name: "Demo\nPHC\r", district: "D".repeat(500), state: "MP\u0000" });
    expect(row?.name).toBe("DemoPHC");
    expect(row?.district).toHaveLength(80);
    expect(row?.state).toBe("MP");
  });
});

describe("ack decoder", () => {
  const base = {
    key: "0x" + "aa".repeat(32),
    creator: W,
    createdAt: 10n,
    expiresAt: 20n,
  };
  const reportKey = "0x" + "bb".repeat(32);

  it("accepts a well-formed ack and drops a hostile report key", () => {
    expect(
      decodeAck({ ...base, attributes: { centreId: cell("str", "DEMO-A"), reportKey: cell("str", reportKey) } })?.reportKey,
    ).toBe(reportKey);
    expect(
      decodeAck({ ...base, attributes: { centreId: cell("str", "DEMO-A"), reportKey: cell("str", "javascript:alert(1)") } }),
    ).toBeNull();
    expect(decodeAck({ ...base, attributes: { centreId: cell("str", "<script>"), reportKey: cell("str", reportKey) } })).toBeNull();
  });
});

describe("poster origin", () => {
  it("ignores X-Forwarded-Host and forces https on Vercel", () => {
    expect(posterOrigin({ host: "board.example", forwardedHost: "evil.example", forwardedProto: "https" })).toBe("https://board.example");
    expect(posterOrigin({ host: "localhost:3300", forwardedHost: "evil.example" })).toBe("http://localhost:3300");
    expect(posterOrigin({ host: "board.example", forwardedProto: "http" }, { VERCEL: "1" })).toBe("https://board.example");
    expect(posterOrigin({ host: "evil.example\r\nX: 1" })).toBe("http://localhost:3000");
    expect(posterOrigin({ host: "evil.example" }, { WEBSITE_HOSTNAME: "jeevanstock.azurewebsites.net" })).toBe("https://jeevanstock.azurewebsites.net");
    expect(posterOrigin({ host: "evil.example" }, { WEBSITE_HOSTNAME: "jeevanstock.azurewebsites.net", CANONICAL_HOST: "jeevan.batmnnn.live" })).toBe("https://jeevan.batmnnn.live");
    expect(posterOrigin({ host: "evil.example" }, { CANONICAL_HOST: "localhost" })).toBe("https://evil.example");
  });
});

describe("explorer links", () => {
  it("never builds a javascript or scheme-relative url", () => {
    expect(entityUrl("javascript:alert(1)")).toBe(EXPLORER);
    expect(addressUrl("javascript:alert(1)")).toBe(EXPLORER);
    expect(txUrl("//evil.example")).toBe(EXPLORER);
    const key = "0x" + "ab".repeat(32);
    const addr = "0x" + "cd".repeat(20);
    expect(entityUrl(key)).toBe(`${EXPLORER}/entity/${key}`);
    expect(addressUrl(addr)).toBe(`${EXPLORER}/address/${addr}`);
  });
});

describe("qr svg", () => {
  it("rejects image, use and animate even without an href", () => {
    expect(safeQrSvg("<svg><image></image></svg>")).toBeNull();
    expect(safeQrSvg("<svg><use></use></svg>")).toBeNull();
    expect(safeQrSvg("<svg><animate></animate></svg>")).toBeNull();
  });
});
