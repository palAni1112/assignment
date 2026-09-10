import { describe, expect, it } from "vitest";

import { isValidDateString } from "./date.js";

describe("isValidDateString", () => {
  it("accepts valid dates", () => {
    expect(
      isValidDateString("2026-09-10")
    ).toBe(true);
  });

  it("rejects invalid month", () => {
    expect(
      isValidDateString("2026-13-10")
    ).toBe(false);
  });

  it("rejects invalid day", () => {
    expect(
      isValidDateString("2026-09-31")
    ).toBe(false);
  });

  it("rejects invalid format", () => {
    expect(
      isValidDateString("10-09-2026")
    ).toBe(false);
  });
});
