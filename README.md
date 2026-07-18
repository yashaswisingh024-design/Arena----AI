# Arena AI – FIFA Smart Stadium Intelligence Platform

### 🏆 Google PROMPT WARS × FIFA World Cup 2026 Challenge Entry


<h1 align="center">🏟️ Arena AI</h1>

<p align="center">
AI-Powered Smart Stadium Intelligence Platform for the FIFA World Cup 2026
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4?logo=google\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 🌍 Overview

Arena AI is an enterprise-grade, AI-powered Smart Stadium Intelligence Platform built for the **Google AI Studio × FIFA World Cup 2026 Challenge**.

Designed specifically for the world's largest sporting event, Arena AI leverages **Google Gemini 2.5 Flash** to deliver real-time crowd intelligence, emergency response coordination, multilingual communication, accessibility services, and operational dashboards through one unified platform.

As FIFA World Cup 2026 expands to **48 teams**, **104 matches**, and **80,000+ spectators per stadium**, Arena AI helps transform traditional stadiums into safer, smarter, and more inclusive environments.

---

# 🔗 Live Demo

### 🌐 Live Website

[https://arenaaai.netlify.app/](https://arenaaai.netlify.app/)

### 💻 GitHub Repository

[https://github.com/yashaswisingh024-design/Arena----AI](https://github.com/yashaswisingh024-design/Arena----AI)


---

# 📚 Table of Contents

* Overview
* Challenge Statement
* AI Solutions
* Platform Features
* Screenshots
* Technology Stack
* AI Architecture
* AI Workflow
* Accessibility
* Security
* Project Structure
* Installation
* Future Roadmap
* Impact
* License

---

# 🏆 Challenge Statement

The FIFA World Cup 2026 is expected to become the largest sporting event in history.

* ⚽ 48 National Teams
* 🏟️ 104 Matches
* 👥 Up to 80,000+ spectators per stadium
* 🌎 Millions of international visitors

Managing crowd movement, emergencies, accessibility, and multilingual communication at this scale requires intelligent, AI-powered decision support.

Arena AI addresses these challenges through Google Gemini-powered real-time stadium intelligence.

---

# 🤖 AI-Powered Solutions

## 🚶 Intelligent Crowd Navigation

* Live congestion detection
* Crowd density heatmaps
* AI-generated alternate routes
* Queue-aware navigation
* Faster stadium entry and exit

---

## 🚨 Emergency Response Intelligence

When an emergency occurs:

* Fire
* Medical emergency
* Security threat
* Hazard spill

Arena AI instantly:

* Detects affected sectors
* Calculates safest evacuation routes
* Avoids congested exits
* Broadcasts multilingual emergency instructions
* Updates command dashboards

---

## 🌡️ Heatwave Protection

Large outdoor stadiums may experience temperatures exceeding **39°C**.

Arena AI provides:

* Hydration reminders
* Nearby water station guidance
* Heat-risk monitoring
* Crowd wellness alerts

---

## 🌐 Multilingual AI Assistant

Supports international visitors with:

* Real-time translation
* Speech synthesis
* Voice assistance
* Eight major international languages

---

## 📡 Offline Resilience

If internet connectivity becomes unavailable:

* Tickets remain accessible
* Routes stay available
* Accessibility guides continue working
* Emergency information remains cached

Powered by LocalSync using browser local storage.

---

# ✨ Platform Features

| Feature                   | Description                    |
| ------------------------- | ------------------------------ |
| 🗺️ Smart Stadium Maps    | Interactive stadium navigation |
| 👥 Crowd Density Heatmaps | Live congestion visualization  |
| 🤖 Gemini AI Assistant    | Intelligent stadium support    |
| 🚨 Emergency Routing      | AI-powered evacuation          |
| 🌍 Multilingual Support   | Eight-language assistance      |
| ♿ Accessibility Mode      | Voice guidance & high contrast |
| 🌡️ Hydration Advisor     | Heatwave protection            |
| 📡 Offline Mode           | LocalSync caching              |
| 📊 Operations Dashboard   | Command center intelligence    |
| 🙋 Volunteer Dashboard    | Volunteer assistance tools     |
| 🎟️ Fan Dashboard         | Personalized fan experience    |

---

# 📸 Platform Preview

## Home Dashboard

<img src="<img width="1754" height="960" alt="Screenshot 2026-07-18 092952" src="https://github.com/user-attachments/assets/906800e7-2e9c-44f7-a7c0-3468f3a5e19e"  width="100%">/>


# 🛠 Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* HTML5
* CSS3

## Backend

* Node.js
* Express.js

## Artificial Intelligence

* Google Gemini 2.5 Flash
* Gemini API

## State Management

* React Context API

## Accessibility

* Web Speech API
* Speech Synthesis
* WCAG 2.2 AA

## Offline Support

* LocalStorage
* LocalSync Engine

---

# 🧠 AI Architecture

```text
                  User

                    │

                    ▼

          React Frontend (Vite)

                    │

                    ▼

         Express Backend API Proxy

                    │

                    ▼

          Google Gemini 2.5 Flash

                    │

                    ▼

      AI Decision & Recommendation

                    │

                    ▼

      Smart Dashboard & Stadium Map
```

---

# 🔄 AI Workflow

```text
Fan reports an issue
          │
          ▼
Google Gemini analyzes context
          │
          ▼
Checks crowd density
          │
          ▼
Checks emergency conditions
          │
          ▼
Calculates safest route
          │
          ▼
Updates dashboard
          │
          ▼
Provides multilingual guidance
```

---

# 🎨 Design Philosophy

Arena AI follows Swiss Modern Design principles.

### Visual Identity

* Slate-based tactical interface
* Emerald status indicators
* High-contrast typography
* Minimal distraction
* Responsive layouts

### Micro-interactions

* Animated radar pulses
* Interactive maps
* Hover transitions
* Live dashboard updates
* Responsive routing indicators

---

# ♿ Accessibility

Arena AI is designed to be inclusive.

Features include:

* WCAG 2.2 AA compliance
* High contrast mode
* Dynamic font scaling
* Keyboard navigation
* Screen reader compatibility
* Speech synthesis
* Voice guidance
* Accessible landmarks
* Visual emergency indicators

---

# 🔒 Security

Arena AI prioritizes security.

## Server-side API Proxy

Gemini API keys remain securely stored on the backend.

No secrets are exposed to clients.

---

## Role-based Access

Separate dashboards for:

* Fans
* Volunteers
* Stadium Operations

---

## Fail-safe Simulation

If Gemini credentials are unavailable:

* Mock AI responses
* Platform remains operational
* No downtime

---

# 📂 Project Structure

```text
Arena AI
│
├── server.ts
│
├── src
│   ├── App.tsx
│   ├── context
│   │      StadiumContext.tsx
│   │
│   ├── components
│   │      StadiumMap.tsx
│   │      AccessibilityPanel.tsx
│   │      Dashboards.tsx
│   │
│   ├── services
│   ├── hooks
│   ├── utils
│   ├── types.ts
│   └── assets
│
├── public
│
└── package.json
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yashaswisingh024-design/Arena----AI.git
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Start production server

```bash
npm run start
```

---

# 🤖 Why Google Gemini?

Arena AI leverages **Google Gemini 2.5 Flash** because it enables:

* Real-time reasoning
* Fast response latency
* Context-aware recommendations
* Structured JSON generation
* Multilingual communication
* Natural language understanding
* Emergency decision support
* Intelligent route planning

---

# 🚀 Future Roadmap

* Live Google Maps integration
* Computer vision crowd analysis
* AI drone surveillance
* Predictive congestion forecasting
* Digital Twin stadium simulation
* Wearable device integration
* Smart parking intelligence
* Public transportation integration

---

# 📈 Expected Impact

Arena AI aims to:

* ✅ Reduce stadium congestion
* ✅ Improve emergency response times
* ✅ Enhance accessibility
* ✅ Support international visitors
* ✅ Improve volunteer coordination
* ✅ Increase operational efficiency
* ✅ Enhance fan safety
* ✅ Deliver AI-powered stadium intelligence

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ❤️ Acknowledgements

Built as part of the **Google Prmpt wars × FIFA World Cup 2026 Challenge**.

Powered by **Google Gemini 2.5 Flash**.

---

# 🌍 Vision

Arena AI demonstrates how artificial intelligence can transform large-scale sporting events into safer, smarter, and more inclusive experiences.

By combining real-time crowd intelligence, multilingual communication, accessibility, emergency response, and operational awareness into a unified platform, Arena AI showcases the potential of Google Gemini to shape the future of smart stadiums for the FIFA World Cup 2026 and beyond.
