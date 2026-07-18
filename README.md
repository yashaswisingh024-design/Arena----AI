<p align="center">
  <img src="./assets/banner.png" alt="Arena AI Banner" width="100%">
</p>

<h1 align="center">🏟️ Arena AI</h1>

<p align="center">
AI-Powered Smart Stadium Intelligence Platform for the FIFA World Cup 2026
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-orange)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![License](https://img.shields.io/badge/License-MIT-green)

</p> # Arena AI – FIFA Smart Stadium Intelligence Platform
### Google AI Studio x FIFA World Cup 2026 Challenge Entry

Arena AI is an enterprise-grade, world-class, full-stack smart stadium intelligence solution designed to revolutionize the tournament experience at the **FIFA World Cup 2026**. Utilizing the power of **Google Gemini 2.5 Flash**, the platform connects fans, venue staff, active volunteers, and command centers through a single unified pane of glass.

---

## 🏟️ Challenge Problem Statement & AI Solutions

The FIFA World Cup 2026 will be the largest in history: **48 teams, 104 matches, and up to 80,000+ fans per stadium**. This density introduces complex physical and digital challenges. Arena AI solves these directly:

1. **Stadium Egress and Entry Bottlenecks**: High crowd density at specific gates (e.g., Gate C) causes extreme wait times. Arena AI's **Smart Maps** overlay live density heatmaps and calculate alternate, queue-aware routes (e.g. redirecting from 25m Gate C delay to 4m Gate D flow).
2. **Dynamic Emergency Drills**: When physical incidents occur (e.g. fire/spills), venue commanders can trigger an **Evacuation Drill**. Gemini API dynamically calculates optimal, non-congested evacuation polylines and pushes tactile exit directives directly to affected sectors.
3. **Severe Summer Heat Waves**: Arlington/Dallas World Cup matches will reach up to 39°C. The platform integrates a **Micro-Climate Hydration Advisor**, locating nearby electrolyte distribution centers and tracking water consumption metrics.
4. **Offline Resilience during Network Blackouts**: During 80k-density network starvations, the app falls back to **Offline LocalSync engine** storing tickets, offline routing paths, and sensory guides in browser `localStorage`.
5. **Multilingual Inclusivity**: Real-time speech-synthesis translations between 8 major international languages supporting international supporters and volunteers.

---

## 🎨 Design and UX Architecture

Designed around Swiss-Modern visual guidelines, Arena AI focuses on high-contrast display typography, balanced negative space, and dark tactical aesthetics.

- **Swiss Slate Theme**: Styled with rich slate grays (`slate-950` / `slate-900`) contrasted with sharp electric emerald green indicators.
- **Micro-Animations**: Uses responsive hover animations, blinking radar loops, and CSS pulse breathing effects on active routing vectors.
- **WCAG 2.2 AA Compliance**: Features built-in high contrast mode, dynamic text resizing scale, tactile aria-labels, keyboard land-marking, and full **Web Speech API Speech Synthesis** simulations for visually impaired fans.

---

## 🚀 Key Modules & File Structure

```bash
├── /server.ts                      # Secure Express Server routing server-side Gemini API calls
├── /src/App.tsx                    # Main App entry layout wrapping Swiss panels and clock
├── /src/context/StadiumContext.tsx # Offline-first local state manager and LocalSync engine
├── /src/types.ts                   # Strict TypeScript structural declarations
├── /src/components/
│   ├── StadiumMap.tsx              # SVG Map layout, density overlays, pathfinding routing
│   ├── AccessibilityPanel.tsx      # Contrast zoom controls, tactile guides, vocalizer, and rescue beacons
│   └── Dashboards.tsx              # Multi-perspective Fan, Volunteer, and Operations terminals
```

---

## 🔒 Security & Data Integrity

- **Server-Side API Proxy**: The `GEMINI_API_KEY` is fully isolated on our Node.js backend. Clients execute proxies through `/api/gemini/*` keeping secrets safe from inspection.
- **Graceful Fail-Safe Simulations**: If the container operates without active API credentials, the platform boots intelligent, dynamic mockup algorithms ensuring the interface executes perfectly with zero downtime.
- **Strict Role Isolation**: Volunteers, Fans, and Commanders access isolated, targeted dashboards.

---

## 📦 Local Compilation & Deployment

To compile and preview the platform locally:

```bash
# Install package dependencies
npm install

# Run full-stack dev server
npm run dev

# Compile static assets and Node server bundle
npm run build

# Start production server
npm run start
```
