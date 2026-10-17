import { describe, expect, it } from "vitest";
import { boardUrl, FALLBACK_ORIGIN, originFromHeaders, parseHost } from "@/lib/dashboard/origin";

describe("parseHost", () => {
  it("accepts hostnames, IPv4 and bracketed IPv6, with a real port", () => {
    expect(parseHost("EXAMPLE.com")).toBe("example.com");
    expect(parseHost("localhost:3000")).toBe("localhost:3000");
    expect(parseHost("127.0.0.1")).toBe("127.0.0.1");
    expect(parseHost("[::1]")).toBe("[::1]");
    expect(parseHost("[::1]:3000")).toBe("[::1]:3000");
  });

  it.each([
    "evil.com\r\nX-Injected: 1",
    "evil.com\nSet-Cookie: a",
    "localhost:3000/admin",
    "user@localhost",
    "localhost:0",
    "localhost:99999",
    "localhost:03000",
    "127.00.0.1",
    "999.1.1.1",
    "https://evil.example",
    "evil.example?x=1",
    "evil.example#frag",
    "evil.example\\@good.example",
    "münchen.de",
    "localhost:3000, evil.example",
    "a..b.com",
    "-bad.com",
    "bad-.com",
    "",
    "x".repeat(401),
    "[:::]",
    "[not-an-ip]",
    "javascript:alert(1)",
  ])("rejects %j", (host) => {
    expect(parseHost(host)).toBeNull();
  });
});

describe("originFromHeaders", () => {
  it("builds https from a public host and an explicit proto", () => {
    expect(originFromHeaders({ host: "jeevan.example", forwardedProto: "https" })).toBe("https://jeevan.example");
  });

  it("prefers a valid forwarded host and falls back to Host when the forwarded value is hostile", () => {
    expect(
      originFromHeaders({ host: "internal.example", forwardedHost: "board.example", forwardedProto: "https" }),
    ).toBe("https://board.example");
    expect(originFromHeaders({ host: "board.example", forwardedHost: "evil.com\r\nX: 1", forwardedProto: "https" })).toBe(
      "https://board.example",
    );
  });

  it("ignores a comma-joined forwarded host and uses Host", () => {
    expect(originFromHeaders({ host: "board.example", forwardedHost: "evil.example, board.example", forwardedProto: "https" })).toBe(
      "https://board.example",
    );
  });

  it("defaults loopback to http and public hosts to https when proto is missing or weird", () => {
    expect(originFromHeaders({ host: "localhost:3000" })).toBe("http://localhost:3000");
    expect(originFromHeaders({ host: "[::1]" })).toBe("http://[::1]");
    expect(originFromHeaders({ host: "board.example", forwardedProto: "javascript" })).toBe("https://board.example");
    expect(originFromHeaders({ host: "localhost", forwardedProto: "HTTPS" })).toBe("https://localhost");
  });

  it("falls back when every host is unusable", () => {
    expect(originFromHeaders({ host: "user@evil", forwardedHost: "../admin" })).toBe(FALLBACK_ORIGIN);
    expect(originFromHeaders({})).toBe(FALLBACK_ORIGIN);
    expect(originFromHeaders({ host: null, forwardedHost: undefined })).toBe(FALLBACK_ORIGIN);
  });
});

describe("boardUrl", () => {
  it("appends the ASV home query to a bare origin", () => {
    expect(boardUrl("https://board.example")).toBe("https://board.example/?need=ASV");
    expect(boardUrl("http://localhost:3000")).toBe("http://localhost:3000/?need=ASV");
    expect(boardUrl(originFromHeaders({ host: "localhost:3000", forwardedProto: "http" }))).toBe(
      "http://localhost:3000/?need=ASV",
    );
  });

  it.each([
    "http://user:pass@board.example",
    "https://board.example/phish",
    "https://board.example/?need=ASV",
    "https://board.example/#x",
    "javascript:alert(1)",
    "http://evil.com\r\n.example",
    "not a url",
    "",
  ])("rejects %j", (origin) => {
    expect(boardUrl(origin)).toBe(`${FALLBACK_ORIGIN}/?need=ASV`);
  });
});
