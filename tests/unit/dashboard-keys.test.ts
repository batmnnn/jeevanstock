import QRCode from "qrcode";
import { describe, expect, it } from "vitest";
import { isProofKey } from "@/lib/dashboard/keys";
import { safeQrSvg } from "@/lib/dashboard/svg";
import { readCommand } from "@/lib/dashboard/trust";

const HEX64 = "ab".repeat(32);

describe("isProofKey", () => {
  it("accepts a 32-byte entity key and shorter 0x-hex", () => {
    expect(isProofKey(`0x${HEX64}`)).toBe(true);
    expect(isProofKey(`0x${"A".repeat(64)}`)).toBe(true);
    expect(isProofKey("0xabc")).toBe(true);
    expect(isProofKey("0x0")).toBe(true);
  });

  it.each([
    "0x",
    `0x${"a".repeat(65)}`,
    `0x${"a".repeat(10_000)}`,
    `0X${HEX64}`,
    `0x${HEX64}\n`,
    `0x${HEX64} `,
    ` 0x${HEX64}`,
    "0xzzzz",
    "0x<script>",
    "../etc/passwd",
    "0xabc/../../admin",
    "javascript:alert(1)",
    "",
    "0x\u0000abcd",
    "0x०१२३",
  ])("rejects %j", (key) => {
    expect(isProofKey(key)).toBe(false);
  });

  it("rejects non-strings, including objects with a hex toString", () => {
    expect(isProofKey(undefined)).toBe(false);
    expect(isProofKey(null)).toBe(false);
    expect(isProofKey(123)).toBe(false);
    expect(isProofKey({ toString: () => `0x${HEX64}` })).toBe(false);
  });
});

describe("safeQrSvg", () => {
  const ok = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0h1v1z"/></svg>';

  it("keeps a single svg and strips an xml declaration", () => {
    expect(safeQrSvg(`<?xml version="1.0"?>\n${ok}`)).toBe(ok);
  });

  it.each([
    `<svg><script>alert(1)</script></svg>`,
    `<svg><path onclick="alert(1)"/></svg>`,
    `<svg><a href="https://evil.example">x</a></svg>`,
    `<svg><foreignObject><iframe src="x"></iframe></foreignObject></svg>`,
    `<svg href="javascript:alert(1)"></svg>`,
    `<div></div>`,
    `<svg></svg><svg></svg>`,
    `  <script></script><svg></svg>`,
    "",
    "x".repeat(50_001),
  ])("rejects %j", (svg) => {
    expect(safeQrSvg(svg)).toBeNull();
  });
});

describe("safeQrSvg with the encoder", () => {
  it("keeps the svg produced for the public board url", async () => {
    const raw = await QRCode.toString("http://localhost:3000/?need=ASV", { type: "svg", margin: 1, errorCorrectionLevel: "M" });
    const svg = safeQrSvg(raw);
    expect(svg?.startsWith("<svg")).toBe(true);
    expect(svg?.endsWith("</svg>")).toBe(true);
    expect(svg).not.toContain("localhost");
  });
});

describe("readCommand", () => {
  const admin = "0x00000000000000000000000000000000000000Ad";

  it("prints the public read command for a real address", () => {
    expect(readCommand(admin)).toBe(`ADMIN_ADDR=${admin} npm run read`);
  });

  it.each(["", "0x123", "0x<script>", "admin; rm -rf /", `${admin}\nINJECT=1`, "not-an-address"])(
    "refuses to echo %j",
    (value) => {
      expect(readCommand(value)).toBe("ADMIN_ADDR=0x… npm run read");
    },
  );
});
