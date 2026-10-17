import { describe, expect, it } from "vitest";
import { parseReportKey } from "@/lib/staff/report-key";

const hex = (n: number) => `0x${"a".repeat(n)}`;

describe("parseReportKey", () => {
  it("accepts 0x plus 1 to 64 hex chars, any case", () => {
    expect(parseReportKey("0xabc")).toBe("0xabc");
    expect(parseReportKey("0xAB")).toBe("0xAB");
    expect(parseReportKey(hex(64))).toBe(hex(64));
    expect(parseReportKey(`0x${"ab".repeat(32)}`)).toHaveLength(66);
  });

  it.each([
    ["0x", "prefix only"],
    [hex(65), "65 hex chars"],
    ["0x" + "a".repeat(10_000), "oversize"],
    ["0Xabc", "uppercase prefix"],
    ["0xGHI", "non-hex"],
    ["0xgg", "non-hex letters"],
    ["abc", "missing prefix"],
    [" 0xabc", "leading space"],
    ["0xabc ", "trailing space"],
    ["0xabc\n", "newline"],
    ["", "empty"],
    ["<script>", "markup"],
    ["0xabc/../admin", "path"],
  ])("rejects %s (%s)", (value) => {
    expect(parseReportKey(value)).toBeNull();
  });

  it.each([null, undefined, 1, true, ["0xabc"], { key: "0xabc" }, new File(["0xabc"], "k.txt")])(
    "rejects non-string %j",
    (value) => {
      expect(parseReportKey(value)).toBeNull();
    },
  );
});
