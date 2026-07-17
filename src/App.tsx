/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StadiumProvider, useStadium } from "./context/StadiumContext";
import { StadiumMap } from "./components/StadiumMap";
import { AccessibilityPanel } from "./components/AccessibilityPanel";
import { Dashboards } from "./components/Dashboards";
import { ShieldAlert, Info, Globe, Cpu, Moon, Sun, HelpCircle } from "lucide-react";

function MainDashboardLayout() {
  const {
    currentUser,
    isHighContrast,
    isDarkMode,
    setDarkMode,
    textScale,
    currentLanguage,
    setLanguage,
  } = useStadium();

  // Keep a digital clock ticking in real-time UTC to simulate live match pacing
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkMode ? "dark" : ""} ${isHighContrast ? "high-contrast" : ""} ${
        isHighContrast
          ? "bg-black text-white"
          : isDarkMode
          ? "bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-400 font-sans"
          : "bg-slate-50 text-slate-900 selection:bg-indigo-500/30 selection:text-indigo-600 font-sans"
      }`}
      style={{ fontSize: `${textScale * 0.875}rem` }} // Accessible font-size modifiers
    >
      {/* Upper Tactical Notification Bar */}
      <div className={`py-2 px-4 text-center text-xs font-mono border-b flex justify-between items-center gap-4 ${
        isHighContrast 
          ? "border-white bg-black text-white" 
          : isDarkMode
          ? "border-slate-800 bg-slate-900 text-slate-100"
          : "border-slate-200 bg-slate-900 text-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse"></span>
          <span>FIFA World Cup Host Command Link: ONLINE</span>
        </div>
        <div className="hidden sm:block">
          <span>UTC LIVE: {currentTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase font-bold ${isHighContrast ? "text-white" : "text-slate-300"}`}>Security Sector: A3</span>
        </div>
      </div>

      {/* Primary Header */}
      <header className={`border-b ${
        isHighContrast 
          ? "border-white bg-black" 
          : isDarkMode
          ? "border-slate-800 bg-slate-900 text-white shadow-md"
          : "border-slate-200 bg-white shadow-sm"
      }`} role="banner">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${
              isHighContrast 
                ? "bg-white text-black" 
                : isDarkMode
                ? "bg-slate-800 border border-slate-700 text-indigo-400"
                : "bg-indigo-50 border border-indigo-100 text-indigo-600"
            }`}>
              <Cpu className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <span className={`text-xs font-bold font-mono tracking-widest block uppercase ${
                isHighContrast ? "text-white" : isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}>
                FIFA World Cup 2026 x Google AI Studio
              </span>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight mt-0.5 ${
                isHighContrast ? "text-white" : isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                ARENA AI – Smart Stadium Intelligence Platform
              </h1>
              <p className={`text-xs mt-1 max-w-xl leading-relaxed ${
                isHighContrast ? "text-slate-300" : isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Empowering fans, operations commanders, and volunteers with server-side secure Gemini 2.5 routing, queue optimization, and WCAG AA accessibility frameworks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isHighContrast
                  ? "bg-black text-white border-white hover:bg-slate-900"
                  : isDarkMode
                  ? "bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="text-xs font-semibold hidden sm:inline">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </button>

            {/* Global Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className={`text-xs rounded-xl py-1.5 px-3 border focus:outline-none focus:border-indigo-500 ${
                  isHighContrast
                    ? "bg-black text-white border-white"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-100 border-slate-700"
                    : "bg-white text-slate-800 border-slate-200 shadow-sm"
                }`}
                aria-label="Select Preferred Interface Language"
              >
              {["English", "Spanish", "French", "German", "Japanese", "Portuguese", "Arabic", "Italian", "Mandarin"].map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12" role="main">
        
        {/* Module 1: Interactive Heatmap Map / Nav */}
        <section aria-labelledby="live-navigation-title">
          <StadiumMap />
        </section>

        {/* Module 2: Accessibility Drawer */}
        <section aria-labelledby="accessibility-panel-title">
          <AccessibilityPanel />
        </section>

        {/* Module 3: Dynamic Multi-Perspectives Dashboards */}
        <section aria-labelledby="operations-dashboard-title">
          <Dashboards />
        </section>

      </main>

      {/* Footer */}
      <footer className={`border-t py-8 text-center text-xs ${
        isHighContrast 
          ? "border-white bg-black text-slate-400" 
          : isDarkMode
          ? "border-slate-800 bg-slate-900 text-slate-400 shadow-inner"
          : "border-slate-200 bg-white text-slate-500 shadow-inner"
      }`} role="contentinfo">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 FIFA World Cup Tournament Operations Group. Powered by Google Gemini-2.5-Flash.</p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            Platform built to strict WCAG 2.2 AA guidelines. Dev Service Endpoint: Dallas/Arlington AT&T Dome.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StadiumProvider>
      <MainDashboardLayout />
    </StadiumProvider>
  );
}
