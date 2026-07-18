import { describe, test, expect } from "vitest";
import {
  getCrowdDensityLevel,
  calculateGreenScoreBonus,
  formatWaitTime,
  getSeverityColor,
} from "../src/utils/stadiumUtils";

describe("stadiumUtils", () => {
  describe("getCrowdDensityLevel", () => {
    test("should return NORMAL for density below 50", () => {
      expect(getCrowdDensityLevel(40)).toBe("NORMAL");
      expect(getCrowdDensityLevel(0)).toBe("NORMAL");
    });

    test("should return CONGESTED for density between 50 and 84", () => {
      expect(getCrowdDensityLevel(50)).toBe("CONGESTED");
      expect(getCrowdDensityLevel(80)).toBe("CONGESTED");
    });

    test("should return CRITICAL for density 85 and above", () => {
      expect(getCrowdDensityLevel(85)).toBe("CRITICAL");
      expect(getCrowdDensityLevel(100)).toBe("CRITICAL");
    });
  });

  describe("calculateGreenScoreBonus", () => {
    test("should return 0 for non-positive trips", () => {
      expect(calculateGreenScoreBonus(0)).toBe(0);
      expect(calculateGreenScoreBonus(-1)).toBe(0);
    });

    test("should return 5 for 1-4 trips", () => {
      expect(calculateGreenScoreBonus(1)).toBe(5);
      expect(calculateGreenScoreBonus(4)).toBe(5);
    });

    test("should return 15 for 5-9 trips", () => {
      expect(calculateGreenScoreBonus(5)).toBe(15);
      expect(calculateGreenScoreBonus(9)).toBe(15);
    });

    test("should return 30 for 10 or more trips", () => {
      expect(calculateGreenScoreBonus(10)).toBe(30);
      expect(calculateGreenScoreBonus(20)).toBe(30);
    });
  });

  describe("formatWaitTime", () => {
    test("should return No wait for 0 or negative minutes", () => {
      expect(formatWaitTime(0)).toBe("No wait");
      expect(formatWaitTime(-5)).toBe("No wait");
    });

    test("should format singular minute correctly", () => {
      expect(formatWaitTime(1)).toBe("1 minute");
    });

    test("should format plural minutes correctly", () => {
      expect(formatWaitTime(10)).toBe("10 minutes");
    });
  });

  describe("getSeverityColor", () => {
    test("should return red classes for CRITICAL severity", () => {
      const color = getSeverityColor("CRITICAL");
      expect(color).toContain("text-red-600");
    });

    test("should return orange classes for HIGH severity", () => {
      const color = getSeverityColor("HIGH");
      expect(color).toContain("text-orange-600");
    });

    test("should return yellow classes for MEDIUM severity", () => {
      const color = getSeverityColor("MEDIUM");
      expect(color).toContain("text-yellow-600");
    });

    test("should return green classes for default/LOW severity", () => {
      const color = getSeverityColor("LOW");
      expect(color).toContain("text-green-600");
    });
  });
});
