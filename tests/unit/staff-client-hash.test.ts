import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CLIENT_HASH_SALT, clientHash, firstForwardedHop } from "@/lib/staff/client-hash";

describe("firstForwardedHop", () => {
  it("uses only the first hop", () => {
    expect(firstForwardedHop("203.0.113.5, 10.0.0.1")).toBe("203.0.113.5");
    expect(firstForwardedHop("  203.0.113.5  , evil")).toBe("203.0.113.5");
    expect(firstForwardedHop("2001:db8::1, 10.0.0.1")).toBe("2001:db8::1");
  });

  it("is empty when the header is missing or blank", () => {
    expect(firstForwardedHop(null)).toBe("");
    expect(firstForwardedHop(undefined)).toBe("");
    expect(firstForwardedHop("")).toBe("");
    expect(firstForwardedHop(",10.0.0.1")).toBe("");
  });

  it("caps a huge hop", () => {
    expect(firstForwardedHop("a".repeat(500))).toHaveLength(128);
  });
});

describe("clientHash", () => {
  it("is sha256 of the first hop concatenated with the fixed salt", () => {
    const hop = "203.0.113.8";
    const expected = createHash("sha256").update(hop + CLIENT_HASH_SALT).digest("hex");
    expect(clientHash(`${hop}, 10.1.1.1`)).toBe(expected);
    expect(clientHash(`  ${hop}  , evil`)).toBe(expected);
  });

  it("is stable hex and never contains the address", () => {
    const hash = clientHash("198.51.100.44, 10.0.0.8");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain("198.51.100.44");
    expect(hash).not.toContain(".");
    expect(clientHash("198.51.100.44")).toBe(hash);
    expect(clientHash("198.51.100.45")).not.toBe(hash);
  });

  it("treats a missing header like an empty one, and caps long hops", () => {
    expect(clientHash(null)).toBe(clientHash(""));
    expect(clientHash(undefined)).toBe(clientHash(null));
    const long = "b".repeat(200);
    expect(clientHash(long)).toBe(clientHash("b".repeat(128)));
    expect(clientHash(long)).not.toBe(clientHash("b".repeat(127)));
  });

  it("does not echo the salt", () => {
    expect(clientHash("203.0.113.9")).not.toContain(CLIENT_HASH_SALT);
  });
});
