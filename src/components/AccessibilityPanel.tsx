/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useStadium } from "../context/StadiumContext";
import { Eye, Volume2, Accessibility, ShieldAlert, CheckCircle, Moon, Sun, HelpCircle } from "lucide-react";

export const AccessibilityPanel: React.FC = () => {
  const {
    isHighContrast,
    setHighContrast,
    isDarkMode,
    setDarkMode,
    textScale,
    setTextScale,
    currentLanguage,
    currentUser,
  } = useStadium();

  const [spokenNotification, setSpokenNotification] = useState<string>("");
  const [activeSensoryWarning, setActiveSensoryWarning] = useState<boolean>(true);
  const [beaconActive, setBeaconActive] = useState<boolean>(false);

  // Accessible voice speech synthesizer simulation using Web Speech API
  const vocalizeText = (text: string) => {
    setSpokenNotification(text);
    if ("speechSynthesis" in window) {
      // Cancel previous speak streams
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower, highly intelligible speech rate
      window.speechSynthesis.speak(utterance);
    }
  };

  // High accessibility preset directions for the seating sector
  const speakSectorGuide = () => {
    const text = `Section 104 Accessibility Route: From the main concourse floor, locate accessible elevator Beta behind gate A. Take elevator up to floor Level 1. Seating Row K has ramp entrances and wheelchair parking spots equipped with local assistance calling buttons.`;
    vocalizeText(text);
  };

  const toggleEmergencyBeacon = () => {
    const nextState = !beaconActive;
    setBeaconActive(nextState);
    if (nextState) {
      vocalizeText("Attention. Emergency accessible locator beacon activated for Alex Thorne at Section 104 Row K Seat 14. Stadium safety personnel have been dispatched.");
    }
  };

  return (
    <div className={`border rounded-2xl p-6 shadow-sm transition-all duration-300 ${
      isHighContrast 
        ? "bg-black border-white text-white" 
        : isDarkMode
        ? "bg-slate-900 border-slate-800 text-slate-100"
        : "bg-white border-slate-200 text-slate-900"
    }`} id="accessibility-assistance-panel">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isHighContrast 
              ? "bg-white text-black" 
              : isDarkMode
              ? "bg-slate-800 border border-slate-700 text-indigo-400"
              : "bg-indigo-50 border border-indigo-100 text-indigo-600"
          }`}>
            <Accessibility className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Accessibility Guidance Hub</h2>
            <p className={`text-xs mt-0.5 ${
              isHighContrast ? "text-slate-300" : isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              WCAG 2.2 AA compliant tools, sensory controls, and voice synthesis directions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dark Mode Toggle inside Accessibility */}
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              isHighContrast
                ? "bg-black text-white border-white hover:bg-slate-900"
                : isDarkMode
                ? "bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDarkMode ? "Switch to Light" : "Enable Dark Mode"}
          </button>

          <button
            onClick={() => setHighContrast(!isHighContrast)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              isHighContrast
                ? "bg-white text-black border-white hover:bg-slate-200"
                : isDarkMode
                ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
            aria-label="Toggle High Contrast Theme"
          >
            <Eye className="h-4 w-4" />
            {isHighContrast ? "Switch to Normal" : "Enable High Contrast"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Text & Contrast Layout Modifiers */}
        <div className={`p-5 rounded-xl border ${
          isHighContrast 
            ? "bg-black border-white" 
            : isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-50 border-slate-200/80"
        }`}>
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono mb-4 flex items-center gap-2">
            <span>01</span> Reader Size Adjustment
          </h3>
          <p className={`text-xs mb-4 leading-relaxed ${
            isHighContrast ? "text-slate-300" : isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            Increase the textual zoom scale for optimal legibility of routing guidelines and stadium alerts.
          </p>
          
          <div className="flex items-center gap-3">
            {[1.0, 1.2, 1.4].map((scale) => (
              <button
                key={scale}
                onClick={() => setTextScale(scale)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  textScale === scale
                    ? isHighContrast
                      ? "bg-white text-black border-white"
                      : "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                    : isHighContrast
                    ? "bg-black text-white border-white hover:bg-slate-900"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {scale === 1.0 ? "Standard" : scale === 1.2 ? "Large (1.2x)" : "Max (1.4x)"}
              </button>
            ))}
          </div>
        </div>

        {/* Module 2: Screen Reader and Voice directions */}
        <div className={`p-5 rounded-xl border ${
          isHighContrast 
            ? "bg-black border-white" 
            : isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-50 border-slate-200/80"
        }`}>
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono mb-4 flex items-center gap-2">
            <span>02</span> Audio Assist & Speech Synthesis
          </h3>
          <p className={`text-xs mb-4 leading-relaxed ${
            isHighContrast ? "text-slate-300" : isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            Simulate a screen-reader to audit high-contrast pathways. Ideal for visually impaired guests.
          </p>

          <div className="space-y-3">
            <button
              onClick={speakSectorGuide}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isHighContrast
                  ? "bg-white text-black border-white hover:bg-slate-200"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              Listen to Section 104 Seating Guide
            </button>

            {spokenNotification && (
              <div className={`p-3 rounded-lg text-[11px] font-mono leading-normal border ${
                isHighContrast ? "bg-black border-white text-white" : "bg-slate-900 border-slate-800 text-slate-100"
              }`}>
                <span className="text-emerald-400 block font-bold mb-1 uppercase text-[9px]">Text Spoken Out:</span>
                "{spokenNotification}"
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Active Sensory Warning & Beacon Locator */}
        <div className={`p-5 rounded-xl border md:col-span-2 lg:col-span-1 ${
          isHighContrast 
            ? "bg-black border-white" 
            : isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-50 border-slate-200/80"
        }`}>
          <h3 className="text-sm font-bold tracking-wide uppercase font-mono mb-4 flex items-center gap-2">
            <span>03</span> Sensory Alerts & Rescues
          </h3>
          
          <div className="space-y-4">
            {/* Sensory crowd level alert */}
            {activeSensoryWarning && (
              <div className={`p-3 rounded-lg border text-xs leading-normal ${
                isHighContrast
                  ? "bg-black border-white text-white"
                  : isDarkMode
                  ? "bg-amber-950/40 border-amber-900/60 text-amber-300"
                  : "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                  <strong>Sensory Notice (Auditory Peak):</strong>
                </div>
                Noise levels near Section 105 are reaching 96dB. Sensory earplugs are available at medical clinic 1 or suites 215.
              </div>
            )}

            {/* Tactical Rescue Beacon */}
            <button
              onClick={toggleEmergencyBeacon}
              className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                beaconActive
                  ? "bg-red-600 text-white border-red-500 animate-pulse"
                  : isHighContrast
                  ? "bg-black text-red-500 border-red-500 hover:bg-red-950/20"
                  : isDarkMode
                  ? "bg-red-950/45 text-red-400 border-red-900/60 hover:bg-red-900/30"
                  : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 shadow-sm"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              {beaconActive ? "Locator Beacon Active (Blinking)" : "TRIGGER ACCESSIBLE RESCUE BEACON"}
            </button>

            {beaconActive && (
              <div className="text-[10px] text-red-500 font-mono text-center animate-pulse">
                🔴 Staff GPS Tracking Active. Remain in your seat (Section 104, Row K, Seat 14).
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Accessible Amenities Map overlay hints */}
      <div className={`mt-6 pt-5 border-t ${isHighContrast ? "border-white" : isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
          isHighContrast ? "text-white" : isDarkMode ? "text-slate-400 font-mono" : "text-slate-400 font-mono"
        }`}>Accessible Stadium Amenities Checklist:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Elevator B (Direct section 104 access)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Quiet Sensory Room (Suite 215, Level 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Wheelchair Battery Charging (Section 102)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>ASL Interpreter Station (Gate A Customer Desk)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
