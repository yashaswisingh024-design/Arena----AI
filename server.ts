/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily & safely
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or uses placeholder. Running in simulated fallback mode.");
    }
    aiClient = new GoogleGenAI({ apiKey: key || "SIMULATED_KEY" });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// CORE SERVER-SIDE GEMINI CONTROLLER (Proxy API endpoints)
// -----------------------------------------------------------------------------

// 1. Dynamic Multilingual AI Assistant Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, userRole, language, ticketSection, ticketSeat } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      // High-quality, context-aware simulated mock fallback to allow offline testing/preview without keys
      const simulatedResponse = simulateStadiumAssistant(message, userRole, language, ticketSection, ticketSeat);
      return res.json({ response: simulatedResponse });
    }

    const ai = getAIClient();
    const prompt = `
      You are the Arena AI assistant for the FIFA World Cup 2026.
      Current User Details:
      - Role: ${userRole}
      - Preferred Language: ${language}
      - Ticket Section: ${ticketSection || "Not seated"}
      - Ticket Seat: ${ticketSeat || "Not seated"}

      The user is asking: "${message}"

      Task:
      Provide a highly precise, accurate, helpful, and polite answer that resolves their stadium-related inquiry.
      If they ask in another language, or if their preferred language is not English, respond in that language (${language}).
      Ensure you address stadium details realistically (we simulate AT&T Stadium Dallas/Arlington for World Cup 2026).
      Keep your answer concise (1-3 paragraphs) with clean bullet points. Write in elegant display Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant error:", error);
    res.status(500).json({ error: "Failed to communicate with Gemini API: " + error.message });
  }
});

// 2. AI-Generated Evacuation Plan Endpoint
app.post("/api/gemini/evacuate", async (req, res) => {
  const { incidentLocation, severity, crowdNodes } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      const simulatedEvac = simulateEvacuation(incidentLocation, severity);
      return res.json(simulatedEvac);
    }

    const ai = getAIClient();
    const prompt = `
      You are the Arena AI Emergency Architect for FIFA World Cup 2026.
      An emergency incident has occurred:
      - Location: ${incidentLocation}
      - Severity: ${severity}
      
      We have the following crowd density nodes active in the stadium:
      ${JSON.stringify(crowdNodes)}

      Task:
      Design a secure, customized, step-by-step emergency evacuation plan.
      You MUST return your response as a valid, parsable JSON object containing exactly these fields:
      - pathNodes: (array of string, identifying the nodes/gates that are SAFE to exit through. Avoid gates closest to the incident)
      - instructions: (array of strings, clear, high-contrast visual escape instructions for fans)
      - safeAssemblyArea: (string, the name of the external transit/parking sector designated as the safe assembly zone)

      Do NOT wrap your JSON response in markdown code blocks like \`\`\`json. Return only pure raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const parsedJson = parseRawJson(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Gemini Evacuation error:", error);
    res.status(500).json({ error: "Failed to compile evacuation plan: " + error.message });
  }
});

// 3. AI Lost & Found Semantic Matchmaker
app.post("/api/gemini/lost-found-match", async (req, res) => {
  const { searchDescription, foundItems } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      const mockMatches = simulateLostFoundMatch(searchDescription, foundItems);
      return res.json({ matches: mockMatches });
    }

    const ai = getAIClient();
    const prompt = `
      You are the Arena AI Security Coordinator.
      A fan has lost an item and describes it as: "${searchDescription}"
      
      Here is the database of found items registered by volunteers/staff:
      ${JSON.stringify(foundItems)}

      Task:
      Perform semantic similarity matching. Evaluate colors, categories, locations, and descriptions.
      Select the best matching found items. Return your response as a valid, parsable JSON array of objects, where each object contains:
      - id: (string, the found item's ID)
      - confidence: (number between 0 and 100, indicating similarity level)
      - reasoning: (string, 1 brief sentence explaining why this matches)

      Do NOT wrap your JSON response in markdown code blocks like \`\`\`json. Return only pure raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const matchedScores = parseRawJson(response.text || "[]");
    res.json({ matches: matchedScores });
  } catch (error: any) {
    console.error("Gemini Lost & Found error:", error);
    res.status(500).json({ error: "Failed to parse matches: " + error.message });
  }
});

// 4. AI Operations Briefing / Incident Summarizer
app.post("/api/gemini/incident-summary", async (req, res) => {
  const { activeIncidents, metrics } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      const mockSummary = simulateIncidentSummary(activeIncidents, metrics);
      return res.json({ summary: mockSummary });
    }

    const ai = getAIClient();
    const prompt = `
      You are the FIFA Venue Commander Commander.
      Analyze the active incidents at Dallas/Arlington Stadium:
      ${JSON.stringify(activeIncidents)}

      Key Stadium Metrics:
      - Water saved: ${metrics.totalWaterSavedGallons} Gallons
      - Public transit usage: ${metrics.publicTransitTrips} trips
      - Waste recycled: ${metrics.totalWasteRecycledKg} KG

      Task:
      Generate an executive-level, highly professional, tactical Situational Report (SITREP) briefing for tournament operations.
      Include:
      - Incident overview & security level
      - Resource management allocation (volunteers vs medics)
      - Key stadium health assessments
      - Next steps for the command chain

      Write in precise, direct, and authoritative stadium operations terms. Support with markdown lists. Keep it highly readable.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini Incident Summarizer error:", error);
    res.status(500).json({ error: "Failed to compile situational summary: " + error.message });
  }
});


// -----------------------------------------------------------------------------
// AUXILIARY / FALLBACK SIMULATION FUNCTIONS
// -----------------------------------------------------------------------------

function simulateStadiumAssistant(msg: string, role: string, lang: string, section: string, seat: string): string {
  const normalized = msg.toLowerCase();
  
  if (normalized.includes("water") || normalized.includes("drink") || normalized.includes("hydrate")) {
    return `### 💧 Hydration & Thermal Advisory (World Cup 2026)
Due to summer temperature peaks in Arlington/Dallas (reaching up to 39°C/102°F outdoors), Arena AI recommends:
- **Free Electrolyte Station**: Located directly behind **Section 105** (just 1 section over from your seat at **${section || "Section 104"}**).
- **Reusable Bottles**: Refillable water points are situated beside all major restrooms. 
- *Acoustic guidance*: Neurodivergent sensory-friendly shaded lounges are available at Level 2, Suite 215.`;
  }

  if (normalized.includes("food") || normalized.includes("eat") || normalized.includes("burger") || normalized.includes("taco")) {
    return `### 🍔 AI Food & Queue-Time Guide
Based on your seat in **${section || "Section 104"}**:
- **El Tri Taco Express** (Section 108): **4-minute wait** (Normal). It is serving premium Mexican tacos with compostable zero-waste packaging (Sustainability Rating: ⭐⭐⭐⭐⭐).
- **Star Spangled Burgers** (Section 101): **15-minute wait** (Congested). 
- *Smart Tip*: Walk towards Section 108 to get food and save up to 11 minutes of waiting time!`;
  }

  if (normalized.includes("toilet") || normalized.includes("restroom") || normalized.includes("bathroom")) {
    return `### 🚻 Restroom Smart Queue Routing
We tracked a peak crowd near Section 104. 
- **Section 104 (Men)**: **12 min wait** (Congested).
- **Section 102 (Accessible)**: **2 min wait** (Normal).
- **Section 212 (Men/Women on Level 2)**: **1 min wait** (Optimal).
- *Recommendation*: Take the Level 1 escalator beside Gate A to the Level 2 concourse. It's a 2-minute walk and has virtually zero queues.`;
  }

  if (normalized.includes("transit") || normalized.includes("bus") || normalized.includes("train") || normalized.includes("uber") || normalized.includes("rideshare")) {
    return `### 🚇 AI Transportation Planner
Arlington Stadium Transit hub is busy:
- **City Rail Link**: Departing every 6 minutes from the South Gate Transit Loop. High boarding density expected between 21:00 and 22:00.
- **Rideshare Hub (Gate D)**: Current wait times for matching is 8 minutes. Surge pricing is stable.
- **Eco-Incentive**: Scan your metro ticket in our **Sustainability Tab** to earn **+15 Green Points**!`;
  }

  return `### 🏟️ Welcome to Arena AI - FIFA World Cup 2026
I am your intelligent assistant tuned to the **Arlington/Dallas Stadium**.
How can I assist you today, **Alex Thorne**? 

**Quick Commands you can try:**
- *“Where is the nearest water station?”*
- *“I want burgers. What is the shortest queue?”*
- *“Which restroom has the shortest queue?”*
- *“What is the best way to get home via public transit?”*`;
}

function simulateEvacuation(loc: string, severity: string): any {
  return {
    pathNodes: ["gate_d", "med_1"],
    instructions: [
      `🚨 EVACUATION ADVISORY FOR ${loc.toUpperCase()} (Severity: ${severity})`,
      `1. Calmly exit your section and walk AWAY from ${loc}.`,
      "2. Proceed towards Gate D (West RideShare Hub), which is completely clear of congestion.",
      "3. Direct any injured or heat-affected spectators to the Main Medical Clinic adjacent to Gate D.",
      "4. Do NOT use elevators or Escalators. Follow green illuminated exit arrows."
    ],
    safeAssemblyArea: "West Parking Lot Sector Alpha (RideShare Zone)"
  };
}

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

function simulateIncidentSummary(incidents: any[], metrics: any): string {
  const reportedCount = incidents.filter(i => i.status === "REPORTED").length;
  const activeCount = incidents.filter(i => i.status === "DISPATCHED").length;
  
  return `### 📝 FIFA World Cup Venue SITREP Briefing
**Arlington Stadium Operations Commander Control**  
*Compiled by Arena AI Co-Pilot*

#### 1. Security & Incident Status
- **Total Registered Logs**: ${incidents.length}
- **Status Breakdown**: ${reportedCount} awaiting triage | ${activeCount} active dispatch | ${incidents.filter(i => i.status === "RESOLVED").length} completed
- **Priority Event**: High-level medical issue at Section 105. Dispatch response completed in 4.2 minutes.

#### 2. Resource & Volunteer Load
- Volunteers are deployed at **Gate C** and **Section 105**.
- Workload balancing remains healthy. Average task resolution is 11.4 minutes.

#### 3. Environmental Sustainability Impact
- **Water Saved**: ${metrics.totalWaterSavedGallons} Gallons via eco-friendly flush monitoring.
- **Rideshare Mitigation**: ${metrics.publicTransitTrips} fans traveled via green light rail.
- **Carbon Offset**: Equivalent to 12.4 tonnes of CO2.

#### 4. Commander Directives
- Monitor gate flow as crowds exit post-match. Maintain Gate D as preferred egress channel due to light road traffic.`;
}

function parseRawJson(raw: string): any {
  try {
    // Sanitize any markdown indicators that Gemini might include
    const sanitized = raw.replace(/```json/gi, "").replace(/```/gi, "").trim();
    return JSON.parse(sanitized);
  } catch (e) {
    console.error("JSON parsing fallback:", e);
    return {};
  }
}

// -----------------------------------------------------------------------------
// VITE DEV SERVER & STATIC PROD DISTRIBUTION
// -----------------------------------------------------------------------------
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite HMR Dev Server middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arena AI Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrapServer().catch((err) => {
  console.error("Critical server bootstrap failure:", err);
});
