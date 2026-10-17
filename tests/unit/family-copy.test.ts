import { describe, expect, it } from "vitest";
import { family } from "@/messages/family";

const BANNED = /wallet|blockchain|crypto|arkiv|tiramisu|seed phrase|private key|0x[0-9a-f]{8,}/i;

function text(lang: "hi" | "en"): string[] {
  const t = family[lang];
  return [
    t.homeTitle,
    t.homeLead,
    t.resultsTitle.ASV,
    t.resultsTitle.ARV,
    t.resultsLead,
    t.whatNext,
    t.whatNextBody,
    t.pending,
    t.locationPrivacy,
    t.notHere,
    t.reportLead,
    t.demoPhones,
    ...Object.values(t.errors),
    ...Object.values(t.reason),
    t.openReports(0),
    t.openReports(1),
    t.openReports(4),
    t.acknowledged(0),
    t.acknowledged(1),
    t.acknowledged(4),
    t.updated("40 मिनट पहले"),
    t.updated("40 minutes ago"),
  ];
}

describe("family copy", () => {
  it("keeps chain jargon out of both languages", () => {
    for (const lang of ["hi", "en"] as const) {
      for (const line of text(lang)) expect(line).not.toMatch(BANNED);
    }
  });

  it("says the record cannot be edited, including by us, and names both lifetimes", () => {
    expect(family.en.whatNextBody).toMatch(/including us/i);
    expect(family.en.whatNextBody).toMatch(/30 days/);
    expect(family.en.whatNextBody).toMatch(/48 hours/);
    expect(family.hi.whatNextBody).toMatch(/हम भी नहीं/);
    expect(family.hi.whatNextBody).toContain("30");
    expect(family.hi.whatNextBody).toContain("48");
  });

  it("uses short counted sentences", () => {
    expect(family.en.openReports(0)).toMatch(/Nobody/);
    expect(family.en.openReports(1)).toMatch(/^1 person/);
    expect(family.en.openReports(3)).toContain("3");
    expect(family.hi.openReports(2)).toContain("2");
    expect(family.hi.acknowledged(0).length).toBeGreaterThan(8);
    expect(family.en.pending.toLowerCase()).toContain("saving");
    expect(family.hi.pending).toContain("सेकंड");
    expect(family.hi.snakebite).toBe("साँप ने काटा");
    expect(family.en.dogbiteEn).toBe("Dog bite");
  });
});
