import { describe, expect, it } from "vitest";

import { timesOverlap } from "./time.js";

describe("timesOverlap", () => {
  it("detects exact overlap", () => {
    expect(
      timesOverlap(
        "10:00",
        "11:00",
        "10:00",
        "11:00"
      )
    ).toBe(true);
  });

  it("detects partial overlap", () => {
    expect(
      timesOverlap(
        "10:30",
        "11:30",
        "10:00",
        "11:00"
      )
    ).toBe(true);
  });

  it("detects nested overlap", () => {
    expect(
      timesOverlap(
        "10:15",
        "10:45",
        "10:00",
        "11:00"
      )
    ).toBe(true);
  });

  it("allows adjacent appointments", () => {
    expect(
      timesOverlap(
        "11:00",
        "12:00",
        "10:00",
        "11:00"
      )
    ).toBe(false);
  });

  it("allows non-overlapping appointments", () => {
    expect(
      timesOverlap(
        "12:00",
        "13:00",
        "10:00",
        "11:00"
      )
    ).toBe(false);
  });
});
