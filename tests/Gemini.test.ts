import { describe, test, expect, vi, beforeEach } from "vitest";

// Simple custom JSON parsing helper analogous to the server-side one
function parseRawJson(raw: string): any {
  try {
    const sanitized = raw.replace(/```json/gi, "").replace(/```/gi, "").trim();
    return JSON.parse(sanitized);
  } catch (e) {
    return {};
  }
}

// Simulated L&F similarity matching logic for testing
function simulateLostFoundMatch(desc: string, items: any[]): any[] {
  const normalized = desc.toLowerCase();
  return items.map(item => {
    let confidence = 10;
    let reasoning = "Low keyword correlation.";
    
    const descMatches = item.description.toLowerCase().split(" ").filter((word: string) => word.length > 3 && normalized.includes(word));
    const titleMatches = item.title.toLowerCase().split(" ").filter((word: string) => word.length > 3 && normalized.includes(word));
    
    if (descMatches.length > 0 || titleMatches.length > 0) {
      confidence = 50 + (descMatches.length + titleMatches.length) * 15;
      reasoning = `Matches keywords: ${[...descMatches, ...titleMatches].join(", ")}.`;
    }
    
    if (normalized.includes(item.color.toLowerCase())) {
      confidence += 20;
      reasoning += " Color profile aligns perfectly.";
    }

    if (confidence > 100) confidence = 98;
    return { id: item.id, confidence, reasoning };
  }).sort((a, b) => b.confidence - a.confidence);
}

describe("Gemini Integration and Simulation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseRawJson", () => {
    test("should parse standard JSON strings", () => {
      const input = '{"status": "ok", "count": 10}';
      const output = parseRawJson(input);
      expect(output).toEqual({ status: "ok", count: 10 });
    });

    test("should handle markdown-wrapped JSON blocks", () => {
      const input = '```json\n{"status": "success"}\n```';
      const output = parseRawJson(input);
      expect(output).toEqual({ status: "success" });
    });

    test("should fallback to empty object on invalid JSON", () => {
      const input = "some non-json text";
      const output = parseRawJson(input);
      expect(output).toEqual({});
    });
  });

  describe("simulateLostFoundMatch", () => {
    const dummyItems = [
      { id: "1", title: "Black Leather Wallet", description: "Contains credit card and driver license", color: "Black" },
      { id: "2", title: "Silver iPhone 15 Pro", description: "Locked phone in a clear plastic case", color: "Silver" },
    ];

    test("should identify match with high confidence based on category/keywords", () => {
      const search = "lost my leather wallet";
      const matches = simulateLostFoundMatch(search, dummyItems);
      
      expect(matches[0].id).toBe("1");
      expect(matches[0].confidence).toBeGreaterThan(50);
    });

    test("should identify matching color perfectly", () => {
      const search = "silver smartphone";
      const matches = simulateLostFoundMatch(search, dummyItems);
      
      expect(matches[0].id).toBe("2");
      expect(matches[0].confidence).toBeGreaterThan(50);
      expect(matches[0].reasoning).toContain("Color profile");
    });
  });
});
