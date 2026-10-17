import { describe, expect, it } from "vitest";
import { centreLimitKey, clientLimitKey, reportClientKey } from "@/lib/family/client-key";
import { FAMILY_LIMITS } from "@/lib/family/limits";

const IP = "203.0.113.10";

describe("report client key", () => {
  it("is a stable hash of the first hop and never the address itself", () => {
    const key = clientLimitKey(`${IP}, 198.51.100.4`);
    expect(key).toBe(clientLimitKey(IP));
    expect(key).toBe(clientLimitKey(`  ${IP}  `));
    expect(key).toMatch(/^family-report:client:[0-9a-f]{64}$/);
    expect(key).not.toContain(IP);
    expect(reportClientKey(IP)).not.toContain(IP);
    expect(clientLimitKey("203.0.113.11")).not.toBe(key);
  });

  it("treats a missing header as one shared bucket", () => {
    expect(clientLimitKey(null)).toBe(clientLimitKey(undefined));
    expect(clientLimitKey(null)).toBe(clientLimitKey(""));
    expect(clientLimitKey(null)).toBe(clientLimitKey(", 198.51.100.4"));
    expect(clientLimitKey(null)).toMatch(/^family-report:client:[0-9a-f]{64}$/);
  });

  it("hashes a very long header without keeping it", () => {
    const huge = `${"1".repeat(5_000)}, 198.51.100.1`;
    const key = clientLimitKey(huge);
    expect(key).toMatch(/^family-report:client:[0-9a-f]{64}$/);
    expect(key).not.toContain("1111");
    expect(key.length).toBe("family-report:client:".length + 64);
  });
});

describe("centre limit key", () => {
  it("accepts a public centre id", () => {
    expect(centreLimitKey("DEMO-RAMPUR-1")).toBe("family-report:centre:DEMO-RAMPUR-1");
    expect(centreLimitKey("ABC")).toBe("family-report:centre:ABC");
    expect(centreLimitKey("A".repeat(40))).toBe(`family-report:centre:${"A".repeat(40)}`);
  });

  it.each([
    "demo-rampur-1",
    "DEMO-RAMPUR-1<script>",
    "../DEMO-RAMPUR-1",
    "DEMO-RAMPUR-1/../admin",
    "AB",
    "",
    "A".repeat(41),
    "constructor",
    "__proto__",
    "DEMO-रामपुर",
    "DEMO RAMPUR",
  ])("refuses %j", (id) => {
    expect(centreLimitKey(id)).toBeNull();
  });
});

describe("family limits", () => {
  it("caps the payer wallet", () => {
    expect(FAMILY_LIMITS.perClient).toEqual({ limit: 3, windowMs: 10 * 60 * 1000 });
    expect(FAMILY_LIMITS.perCentre).toEqual({ limit: 30, windowMs: 60 * 60 * 1000 });
  });
});
