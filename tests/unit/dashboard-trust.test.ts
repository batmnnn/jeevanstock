import { describe, expect, it } from "vitest";
import { trustVerdict, type TrustSnapshot } from "@/lib/dashboard/trust";

const ADMIN = "0x00000000000000000000000000000000000000Ad";
const PAYER = "0x00000000000000000000000000000000000000Ba";
const WALLET = "0x00000000000000000000000000000000000000C0";
const OTHER = "0x00000000000000000000000000000000000000Ee";

const snap: TrustSnapshot = {
  admin: ADMIN,
  payer: PAYER,
  centres: [{ centreId: "DEMO-RAMPUR-1", wallet: WALLET, creator: ADMIN }],
};

describe("trustVerdict", () => {
  it("trusts stock only from that centre's registered wallet, ignoring case", () => {
    expect(
      trustVerdict({ kind: "stock", creator: WALLET.toLowerCase(), attributes: { centreId: "DEMO-RAMPUR-1" } }, snap).trusted,
    ).toBe(true);
    expect(trustVerdict({ kind: "stock", creator: WALLET.toLowerCase(), attributes: { centreId: "DEMO-RAMPUR-1" } }, snap).code).toBe(
      "stock-centre",
    );
  });

  it("ignores a spoofed stock post and a post aimed at an unknown centre", () => {
    expect(trustVerdict({ kind: "stock", creator: OTHER, attributes: { centreId: "DEMO-RAMPUR-1" } }, snap)).toEqual({
      trusted: false,
      code: "creator-mismatch",
    });
    expect(trustVerdict({ kind: "stock", creator: WALLET, attributes: { centreId: "DEMO-OTHER" } }, snap).code).toBe("unknown-centre");
    expect(trustVerdict({ kind: "stock", creator: WALLET, attributes: {} }, snap).code).toBe("unknown-centre");
    expect(trustVerdict({ kind: "stock", creator: WALLET, attributes: { centreId: "../ADMIN" } }, snap).code).toBe("unknown-centre");
    expect(trustVerdict({ kind: "stock", creator: WALLET, attributes: { centreId: "demo-rampur-1" } }, snap).code).toBe("unknown-centre");
  });

  it("does not accept another centre's wallet for this centre", () => {
    const two: TrustSnapshot = { ...snap, centres: [...snap.centres, { centreId: "DEMO-SONPUR-CHC", wallet: OTHER, creator: ADMIN }] };
    expect(trustVerdict({ kind: "stock", creator: OTHER, attributes: { centreId: "DEMO-RAMPUR-1" } }, two).code).toBe("creator-mismatch");
  });

  it("trusts a report only when the creator is the payer", () => {
    expect(trustVerdict({ kind: "report", creator: PAYER, attributes: { centreId: "NOPE" } }, snap)).toEqual({
      trusted: true,
      code: "report-payer",
    });
    expect(trustVerdict({ kind: "report", creator: WALLET, attributes: {} }, snap)).toEqual({ trusted: false, code: "creator-mismatch" });
    expect(trustVerdict({ kind: "report", creator: ` ${PAYER}`, attributes: {} }, snap).trusted).toBe(false);
    expect(trustVerdict({ kind: "report", creator: "", attributes: {} }, snap).trusted).toBe(false);
  });

  it("trusts a centre only from the admin wallet, not from the centre wallet", () => {
    expect(trustVerdict({ kind: "centre", creator: ADMIN.toLowerCase(), attributes: { wallet: OTHER } }, snap)).toEqual({
      trusted: true,
      code: "centre-admin",
    });
    expect(trustVerdict({ kind: "centre", creator: WALLET, attributes: {} }, snap).code).toBe("creator-mismatch");
  });

  it("rejects lookalike kinds and empty authorities", () => {
    expect(trustVerdict({ kind: "stock ", creator: WALLET, attributes: { centreId: "DEMO-RAMPUR-1" } }, snap).code).toBe("unknown-kind");
    expect(trustVerdict({ kind: "STOCK", creator: WALLET, attributes: { centreId: "DEMO-RAMPUR-1" } }, snap).code).toBe("unknown-kind");
    expect(trustVerdict({ kind: "beds", creator: ADMIN, attributes: {} }, snap).code).toBe("unknown-kind");
    expect(trustVerdict({ kind: "centre", creator: ADMIN, attributes: {} }, { ...snap, admin: "" }).trusted).toBe(false);
    expect(trustVerdict({ kind: "report", creator: PAYER, attributes: {} }, { ...snap, payer: "payer" }).trusted).toBe(false);
  });
});
