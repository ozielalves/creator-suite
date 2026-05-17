import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, formatRelativeTime } from "./format";

describe("format utils", () => {
  it("formats currency in USD", () => {
    expect(formatCurrency(2900)).toBe("$29");
  });
  it("formats large numbers with separators", () => {
    expect(formatNumber(3482)).toBe("3,482");
  });
  it("returns 'just now' for very recent timestamps", () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe("just now");
  });
});
