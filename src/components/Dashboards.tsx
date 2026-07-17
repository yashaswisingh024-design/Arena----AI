/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useStadium } from "../context/StadiumContext";
import { UserRole, IncidentReport, LostFoundItem, VolunteerTask } from "../types";
import {
  Ticket,
  Calendar,
  Utensils,
  Droplet,
  Shuffle,
  Compass,
  AlertOctagon,
  Users,
  Briefcase,
  Layers,
  CheckCircle,
  Globe,
  Search,
  Upload,
  Plus,
  Send,
  Loader2,
  AlertTriangle,
  Leaf,
  HelpCircle,
} from "lucide-react";

export const Dashboards: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    matches,
    setMatches,
    restrooms,
    setRestrooms,
    foodStands,
    setFoodStands,
    incidents,
    setIncidents,
    tasks,
    setTasks,
    lostFoundItems,
    setLostFoundItems,
    sustainability,
    setSustainability,
    stadiumNodes,
    setEvacuationActive,
    setEvacuationInstruction,
    isEvacuationActive,
    currentLanguage,
    setLanguage,
    isHighContrast,
    isDarkMode,
  } = useStadium();

  // Active dashboard view toggle
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.FAN);

  // Loading indicator states
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [chatResponse, setChatResponse] = useState<string>("");
  const [chatInput, setChatInput] = useState<string>("");

  // ---------------------------------------------------------------------------
  // FAN VIEW LOCAL STATES
  // ---------------------------------------------------------------------------
  const [orderedFoodId, setOrderedFoodId] = useState<string | null>(null);
  const [lostDescription, setLostDescription] = useState<string>("");
  const [foundMatches, setFoundMatches] = useState<any[]>([]);
  const [hasSearchedLost, setHasSearchedLost] = useState<boolean>(false);
  const [loggedTransit, setLoggedTransit] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // VOLUNTEER VIEW LOCAL STATES
  // ---------------------------------------------------------------------------
  const [translationText, setTranslationText] = useState<string>("");
  const [translatedOutput, setTranslatedOutput] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("Spanish");

  // ---------------------------------------------------------------------------
  // STAFF VIEW LOCAL STATES
  // ---------------------------------------------------------------------------
  const [sitrepOutput, setSitrepOutput] = useState<string>("");
  const [newIncidentTitle, setNewIncidentTitle] = useState<string>("");
  const [newIncidentLocation, setNewIncidentLocation] = useState<string>("");
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("LOW");
  const [newIncidentCategory, setNewIncidentCategory] = useState<"MEDICAL" | "SECURITY" | "MAINTENANCE" | " crowd_control">("SECURITY");
  const [evacLocation, setEvacLocation] = useState<string>("Gate C (South Transit Loop)");

  // ---------------------------------------------------------------------------
  // GEMINI SERVICE PROXY FETCHERS
  // ---------------------------------------------------------------------------

  // A. AI Assistant General Chat Request
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setAiLoading(true);
    setChatResponse("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          userRole: activeTab,
          language: currentLanguage,
          ticketSection: currentUser.ticketSection,
          ticketSeat: currentUser.ticketSeat,
        }),
      });

      const data = await response.json();
      setChatResponse(data.response || "No response received.");
    } catch (err: any) {
      setChatResponse(`Error connecting to AI Assistant: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // B. AI Lost & Found Semantic Matcher
  const handleLostFoundSearch = async () => {
    if (!lostDescription.trim()) return;

    setAiLoading(true);
    setHasSearchedLost(true);
    setFoundMatches([]);

    try {
      const response = await fetch("/api/gemini/lost-found-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchDescription: lostDescription,
          foundItems: lostFoundItems.filter((item) => item.status === "FOUND"),
        }),
      });

      const data = await response.json();
      setFoundMatches(data.matches || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // C. AI Multilingual Translation
  const handleTranslationRequest = async () => {
    if (!translationText.trim()) return;

    setAiLoading(true);
    setTranslatedOutput("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Translate the following string exactly into beautiful ${targetLanguage}: "${translationText}". Return ONLY the translation, with no extra conversational fillers.`,
          userRole: UserRole.VOLUNTEER,
          language: targetLanguage,
        }),
      });

      const data = await response.json();
      setTranslatedOutput(data.response || "Translation failed.");
    } catch (err: any) {
      setTranslatedOutput(`Translation Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // D. AI Executive Operations SITREP Summarizer
  const handleGenerateSitrep = async () => {
    setAiLoading(true);
    setSitrepOutput("");

    try {
      const response = await fetch("/api/gemini/incident-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeIncidents: incidents,
          metrics: sustainability,
        }),
      });

      const data = await response.json();
      setSitrepOutput(data.response || data.summary || "No operational briefing generated.");
    } catch (err: any) {
      setSitrepOutput(`Error compiling SITREP briefing: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // E. AI Emergency Evacuation Drill Coordinator
  const handleTriggerEvacuation = async () => {
    setAiLoading(true);

    try {
      const response = await fetch("/api/gemini/evacuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentLocation: evacLocation,
          severity: "CRITICAL",
          crowdNodes: stadiumNodes,
        }),
      });

      const data = await response.json();
      
      // Update global context
      setEvacuationActive(true);
      const escapeInstructions = data.instructions?.join("\n") || `ALERT: Evacuation triggered for ${evacLocation}. Seek safe assembly area immediately.`;
      setEvacuationInstruction(escapeInstructions);
    } catch (err: any) {
      console.error(err);
      setEvacuationActive(true);
      setEvacuationInstruction(`EMERGENCY: Evacuate ${evacLocation} immediately towards the West Parking Zone.`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStopEvacuation = () => {
    setEvacuationActive(false);
    setEvacuationInstruction("");
  };

  // ---------------------------------------------------------------------------
  // USER ACTIONS / OPTIMISTIC MUTATIONS
  // ---------------------------------------------------------------------------

  // 1. Pre-ordering food with queue check
  const preOrderFood = (standId: string) => {
    setOrderedFoodId(standId);
    // Dynamically adjust wait time in local context
    setFoodStands((prev) =>
      prev.map((stand) =>
        stand.id === standId
          ? { ...stand, waitTimeMinutes: stand.waitTimeMinutes + 2, status: "CONGESTED" }
          : stand
      )
    );
    // Small celebration or alert
    setTimeout(() => {
      setOrderedFoodId(null);
      alert("🍜 Order Placed Successfully! Your QR pickup ticket is saved. Navigate to the stand's GreenLane for fast pickup.");
    }, 2500);
  };

  // 2. Logging Green Rideshare points
  const claimGreenPoints = () => {
    if (loggedTransit) return;
    setLoggedTransit(true);
    setCurrentUser({
      ...currentUser,
      greenScore: currentUser.greenScore + 15,
    });
    setSustainability({
      ...sustainability,
      publicTransitTrips: sustainability.publicTransitTrips + 1,
    });
  };

  // 3. Completing Volunteer Tasks
  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED" }
          : t
      )
    );
  };

  // 4. Staff logging new incident
  const createNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle.trim() || !newIncidentLocation.trim()) return;

    const newInc: IncidentReport = {
      id: `inc_${Date.now()}`,
      title: newIncidentTitle,
      description: `Reported via staff terminal at ${newIncidentLocation}.`,
      location: newIncidentLocation,
      severity: newIncidentSeverity,
      status: "REPORTED",
      category: newIncidentCategory,
      reportedAt: new Date().toISOString(),
    };

    setIncidents((prev) => [newInc, ...prev]);
    setNewIncidentTitle("");
    setNewIncidentLocation("");
  };

  return (
    <div className="space-y-8" id="arena-dashboards-module">
      
      {/* 1. Global Role Selection Swapper */}
      <div className={`border rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm ${
        useStadium().isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex items-center gap-3">
          <Compass className={`h-6 w-6 animate-spin ${useStadium().isHighContrast ? "text-white" : "text-indigo-600"}`} style={{ animationDuration: "12s" }} />
          <div>
            <span className={`text-[10px] font-mono block uppercase ${useStadium().isHighContrast ? "text-white" : "text-slate-400"}`}>Interactive Workspace</span>
            <h1 className={`text-sm font-bold tracking-wide uppercase ${useStadium().isHighContrast ? "text-white" : "text-slate-800"}`}>Toggle Simulation Persona</h1>
          </div>
        </div>

        <div className={`flex p-1 rounded-xl w-full md:w-auto border ${
          useStadium().isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
        }`}>
          {[
            { id: UserRole.FAN, label: "Fan Experience", icon: Ticket },
            { id: UserRole.VOLUNTEER, label: "Volunteer Hub", icon: Users },
            { id: UserRole.STAFF, label: "Operations Cmd", icon: Briefcase },
          ].map((role) => {
            const Icon = role.icon;
            const isActive = activeTab === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveTab(role.id);
                  // Sync role inside currentUser context
                  setCurrentUser({ ...currentUser, role: role.id });
                }}
                className={`flex-1 md:flex-initial py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? useStadium().isHighContrast
                      ? "bg-white text-black border-white"
                      : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                    : useStadium().isHighContrast
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evacuation Alert Box */}
      {isEvacuationActive && (
        <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-5 text-red-200 shadow-2xl animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <AlertOctagon className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-base uppercase tracking-wide font-black text-red-400 block">AI-ROUTED EVACUATION ORDER</strong>
                <pre className="text-xs font-sans whitespace-pre-wrap leading-normal mt-2 bg-slate-950/60 p-4 border border-red-900 rounded-xl">
                  {useStadium().evacuationInstruction}
                </pre>
              </div>
            </div>
            {activeTab === UserRole.STAFF && (
              <button
                onClick={handleStopEvacuation}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-all shrink-0"
              >
                Clear Drill Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Interactive Column: Persona-Specific Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Dashboard Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ===================================================================
              A. FAN VIEW PANEL
              =================================================================== */}
          {activeTab === UserRole.FAN && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Match Card & Ticket Info */}
              <div className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-850 shadow-sm"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b ${
                  isHighContrast ? "border-white" : "border-slate-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isHighContrast ? "bg-white text-black" : "bg-indigo-50 border border-indigo-100 text-indigo-600"}`}>
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>Alex Thorne's Seat Pass</h3>
                      <p className={`text-xs mt-0.5 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>FIFA World Cup 2026 Quarter-Finals Pass</p>
                    </div>
                  </div>

                  <span className={`text-xs py-1 px-3 rounded-full font-mono uppercase tracking-wide border ${
                    isHighContrast ? "bg-black border-white text-white" : "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}>
                    {currentUser.ticketSection} | {currentUser.ticketSeat}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                  {/* Live Match Info */}
                  <div>
                    <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-white" : "text-slate-400"}`}>Current Match Schedule</span>
                    <div className={`border rounded-xl p-4 mt-2 ${
                      isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200/60"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-red-600 text-white py-0.5 px-2 rounded font-mono font-bold animate-pulse">
                          LIVE - HALF TIME
                        </span>
                        <span className={`text-xs font-mono ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>Quarter-Final</span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-center flex-1">
                          <span className="text-2xl block mb-1">{matches[0].homeFlag}</span>
                          <span className={`text-xs font-bold block truncate ${isHighContrast ? "text-white" : "text-slate-800"}`}>{matches[0].homeTeam}</span>
                        </div>
                        <div className={`text-2xl font-black font-mono px-4 ${isHighContrast ? "text-white" : "text-slate-800"}`}>
                          {matches[0].score?.home} - {matches[0].score?.away}
                        </div>
                        <div className="text-center flex-1">
                          <span className="text-2xl block mb-1">{matches[0].awayFlag}</span>
                          <span className={`text-xs font-bold block truncate ${isHighContrast ? "text-white" : "text-slate-800"}`}>{matches[0].awayTeam}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Micro-Climate advisory */}
                  <div className={`border rounded-xl p-4 flex flex-col justify-between ${
                    isHighContrast ? "bg-black border-white" : "bg-amber-50/55 border-amber-200/80"
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 font-mono uppercase">
                        <Droplet className="h-3.5 w-3.5 text-amber-600" />
                        Micro-Climate Hydration Alert
                      </div>
                      <p className={`text-xs mt-2 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-amber-900"}`}>
                        Arlington heat dome active outdoors. Keep fluids topped up. We've mapped a free smart electrolyte hydration point <strong>100m away behind Section 105</strong>.
                      </p>
                    </div>
                    <div className={`text-[10px] font-mono mt-2 ${isHighContrast ? "text-slate-300" : "text-amber-700/85"}`}>
                      💡 Bring your reusable bottle for -20% food cup discount!
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue-Aware Food Pre-Ordering */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className={`h-5 w-5 animate-bounce ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
                  <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>AI Queue-Aware Gastronomy</h3>
                </div>
                <p className={`text-xs mb-4 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                  Avoid 20-minute concession bottlenecks. Pre-order with real-time lane tracking. We redirect you to the closest stands with low queues.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foodStands.map((stand) => (
                    <div key={stand.id} className={`border rounded-xl p-4 flex flex-col justify-between ${
                      isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <div>
                            <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>{stand.cuisine} • {stand.level}</span>
                            <h4 className={`text-sm font-bold mt-0.5 ${isHighContrast ? "text-white" : "text-slate-800"}`}>{stand.name}</h4>
                          </div>
                          <span className={`text-[10px] py-0.5 px-2 rounded-full font-mono font-bold uppercase border ${
                            stand.status === "CRITICAL"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : stand.status === "CONGESTED"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {stand.waitTimeMinutes} Min Wait
                          </span>
                        </div>

                        <div className="mt-2 text-xs">
                          <strong className={`text-[10px] block mb-1 ${isHighContrast ? "text-white font-bold" : "text-emerald-700 font-bold"}`}>Today's Zero-Waste Special:</strong>
                          <span className={isHighContrast ? "text-slate-200" : "text-slate-600"}>{stand.specials[0]}</span>
                        </div>
                      </div>

                      <div className={`mt-4 pt-3 border-t flex justify-between items-center gap-2 ${
                        isHighContrast ? "border-white" : "border-slate-200/80"
                      }`}>
                        <span className={`text-[10px] font-mono ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>Rating: {"⭐".repeat(stand.sustainabilityRating)}</span>
                        <button
                          onClick={() => preOrderFood(stand.id)}
                          disabled={orderedFoodId !== null}
                          className={`text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                            isHighContrast
                              ? "bg-white text-black hover:bg-slate-200"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          }`}
                        >
                          {orderedFoodId === stand.id ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Placing...
                            </span>
                          ) : (
                            "Pre-order & Save Wait Time"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco-Sustainability Transit score Tracker */}
              <div className={`border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${
                    isHighContrast ? "bg-white text-black" : "bg-emerald-50 border border-emerald-100 text-emerald-600"
                  }`}>
                    <Leaf className="h-6 w-6 shrink-0" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>Earn Green Fan Points</h3>
                    <p className={`text-xs mt-1 max-w-md ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                      Log your public transit trip (Arlington Metro or City Rail shuttles) to earn **+15 green points**. Level up your Green Fan Profile to claim exclusive FIFA 2026 digital badges!
                    </p>
                  </div>
                </div>

                <div className={`border rounded-xl p-4 w-full md:w-auto text-center shrink-0 shadow-sm ${
                  isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                }`}>
                  <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-white" : "text-slate-400"}`}>Your Green Score</span>
                  <span className={`text-2xl font-black block mt-1 ${isHighContrast ? "text-white" : "text-emerald-600"}`}>{currentUser.greenScore} pts</span>
                  <button
                    onClick={claimGreenPoints}
                    disabled={loggedTransit}
                    className={`w-full mt-3 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                      isHighContrast
                        ? "bg-white text-black disabled:bg-slate-900 disabled:text-slate-500 border border-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-100 disabled:text-slate-400"
                    }`}
                  >
                    {loggedTransit ? "Points Credited! ✓" : "I rode public transit (+15 pts)"}
                  </button>
                </div>
              </div>

              {/* Semantic Lost & Found */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Search className={`h-5 w-5 ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
                  <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>Semantic AI Lost & Found Assistant</h3>
                </div>
                <p className={`text-xs mb-4 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                  Lost an item? Type a description (e.g. "black wallet with credit card" or "silver iPhone"). Our AI matches it semantically against found items cataloged by active volunteers in real-time.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lostDescription}
                    onChange={(e) => setLostDescription(e.target.value)}
                    placeholder="Enter item color, shape, materials, or locations where lost..."
                    className={`flex-1 rounded-xl px-4 py-2 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                      isHighContrast 
                        ? "bg-black border-white text-white placeholder-slate-400" 
                        : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
                    }`}
                  />
                  <button
                    onClick={handleLostFoundSearch}
                    disabled={aiLoading}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isHighContrast
                        ? "bg-white text-black hover:bg-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search Lost Items"}
                  </button>
                </div>

                {hasSearchedLost && (
                  <div className="mt-5 space-y-3">
                    <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-white" : "text-slate-400"}`}>Semantic Inventory Match Results</span>
                    
                    {foundMatches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {foundMatches.map((match) => {
                          const item = lostFoundItems.find((i) => i.id === match.id);
                          if (!item) return null;
                          return (
                            <div key={item.id} className={`border rounded-xl p-3 flex flex-col justify-between shadow-sm ${
                              isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                            }`}>
                              <div>
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className={`text-xs font-bold ${isHighContrast ? "text-white" : "text-slate-800"}`}>{item.title}</h4>
                                  <span className={`text-[9px] font-mono py-0.5 px-2 rounded-full font-bold border ${
                                    match.confidence > 75
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : match.confidence > 45
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}>
                                    {match.confidence}% Match
                                  </span>
                                </div>
                                <p className={`text-[11px] mt-1 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>{item.description}</p>
                                <span className={`text-[10px] font-mono mt-2 block ${isHighContrast ? "text-slate-400" : "text-slate-400"}`}>Found at: {item.locationLost}</span>
                              </div>

                              <p className={`text-[10px] font-mono border p-2 rounded mt-3 ${
                                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-700"
                              }`}>
                                <strong>AI Match Reasoning:</strong> {match.reasoning}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`text-xs py-6 text-center border rounded-xl ${
                        isHighContrast ? "bg-black border-white text-white" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        No matches found yet. Keep your search terms simple, describing colors and distinct features.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================
              B. VOLUNTEER HUB PANEL
              =================================================================== */}
          {activeTab === UserRole.VOLUNTEER && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Shift and Task dispatcher */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className={`h-5 w-5 ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
                    <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>Your Active Volunteer Shift Dispatch</h3>
                  </div>
                  <span className={`text-[10px] py-0.5 px-2 rounded-full font-mono border ${
                    isHighContrast ? "bg-black border-white text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    Shift ID: V-9034
                  </span>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className={`border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm ${
                      isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isHighContrast ? "text-white" : "text-slate-800"}`}>{task.title}</h4>
                          <span className={`text-[9px] font-mono py-0.5 px-1.5 rounded uppercase font-bold border ${
                            task.severity === "HIGH"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {task.severity}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>{task.description}</p>
                        <span className={`text-[10px] font-mono mt-1.5 block ${isHighContrast ? "text-slate-400" : "text-slate-400"}`}>Location Sector: {task.location}</span>
                      </div>

                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          task.status === "COMPLETED"
                            ? isHighContrast
                              ? "bg-black border-white text-white border"
                              : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                            : isHighContrast
                            ? "bg-white text-black border-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        }`}
                      >
                        {task.status === "COMPLETED" ? "✓ Done (Completed)" : "Mark Completed"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multilingual Voice/Text Translation box */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className={`h-5 w-5 ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
                  <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>AI Multilingual Volunteer Translator</h3>
                </div>
                <p className={`text-xs mb-4 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                  Support international fans seamlessly. Type or speak a greeting, directions, or transit guidance, select the target language, and generate an instant, translation with optimal sports terms.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <textarea
                      value={translationText}
                      onChange={(e) => setTranslationText(e.target.value)}
                      placeholder="Type directions, guidelines, or greeting here..."
                      className={`w-full rounded-xl p-3 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-[100px] resize-none ${
                        isHighContrast 
                          ? "bg-black border-white text-white placeholder-slate-400" 
                          : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
                      }`}
                    ></textarea>
                  </div>

                  <div className="flex flex-col justify-between gap-3">
                    <div>
                      <label className={`text-[10px] font-mono uppercase block mb-1 ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>Target Language</label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className={`w-full rounded-lg py-1.5 px-2.5 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                          isHighContrast 
                            ? "bg-black border-white text-white" 
                            : "bg-white border-slate-200 text-slate-700 shadow-sm"
                        }`}
                      >
                        {["Spanish", "French", "German", "Japanese", "Portuguese", "Arabic", "Italian", "Mandarin"].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleTranslationRequest}
                      disabled={aiLoading}
                      className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isHighContrast
                          ? "bg-white text-black hover:bg-slate-200"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      }`}
                    >
                      {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Translate Now"}
                    </button>
                  </div>
                </div>

                {translatedOutput && (
                  <div className={`mt-5 p-4 border rounded-xl ${
                    isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                  }`}>
                    <span className={`text-[10px] font-mono font-bold block mb-2 uppercase ${isHighContrast ? "text-white" : "text-indigo-600"}`}>Translated Output ({targetLanguage})</span>
                    <p className={`text-sm font-semibold italic ${isHighContrast ? "text-white" : "text-slate-800"}`}>"{translatedOutput}"</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================
              C. STAFF/COMMANDER VIEW PANEL
              =================================================================== */}
          {activeTab === UserRole.STAFF && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Emergency drill dispatcher */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>AI Emergency Evacuation Coordinator</h3>
                </div>
                <p className={`text-xs mb-4 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                  Trigger tactical evacuation routes mapped dynamically by Gemini API. It calculates safe assembly zones, avoiding the congestion center and active bottlenecks.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={evacLocation}
                    onChange={(e) => setEvacLocation(e.target.value)}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                      isHighContrast 
                        ? "bg-black border-white text-white" 
                        : "bg-white border-slate-200 text-slate-700 shadow-sm"
                    }`}
                  >
                    <option value="Gate C (South Transit Loop)">Gate C (South Transit Loop) - High Density</option>
                    <option value="Concourse North (Section 101-105)">Concourse North (Section 101-105)</option>
                    <option value="Main Emergency Medical Clinic">Main Emergency Medical Clinic</option>
                  </select>

                  <button
                    onClick={handleTriggerEvacuation}
                    disabled={aiLoading}
                    className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                      isHighContrast
                        ? "bg-red-600 text-white hover:bg-red-500 border border-red-500"
                        : "bg-red-600 hover:bg-red-500 text-white shadow-sm"
                    }`}
                  >
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Deploy Emergency Drill Routing"}
                  </button>
                </div>
              </div>

              {/* Incidents Logger */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertOctagon className={`h-5 w-5 ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
                  <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>Venue Incident Logger Terminal</h3>
                </div>

                <form onSubmit={createNewIncident} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className={`text-[10px] font-mono uppercase block mb-1 ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>Incident title / hazard</label>
                    <input
                      type="text"
                      value={newIncidentTitle}
                      onChange={(e) => setNewIncidentTitle(e.target.value)}
                      placeholder="e.g., Blocked Fire Escape, Water Leakage"
                      className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                        isHighContrast 
                          ? "bg-black border-white text-white placeholder-slate-400" 
                          : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-[10px] font-mono uppercase block mb-1 ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>Location Sector</label>
                    <input
                      type="text"
                      value={newIncidentLocation}
                      onChange={(e) => setNewIncidentLocation(e.target.value)}
                      placeholder="e.g., Gate B, Section 105"
                      className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                        isHighContrast 
                          ? "bg-black border-white text-white placeholder-slate-400" 
                          : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`text-xs font-bold py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      isHighContrast
                        ? "bg-white text-black border border-white hover:bg-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Register Incident
                  </button>
                </form>

                {/* Live Incidents Grid */}
                <div className="mt-6">
                  <span className={`text-[10px] font-mono block uppercase mb-3 ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>Live Active Venue Incidents</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {incidents.map((inc) => (
                      <div key={inc.id} className={`border rounded-xl p-3 flex flex-col justify-between shadow-sm ${
                        isHighContrast ? "bg-black border-white" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className={`text-[9px] font-mono uppercase ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>{inc.category}</span>
                            <span className={`text-[8px] font-mono py-0.5 px-1.5 rounded uppercase font-bold border ${
                              inc.severity === "CRITICAL"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {inc.severity}
                            </span>
                          </div>
                          <h4 className={`text-xs font-bold mt-1 ${isHighContrast ? "text-white" : "text-slate-800"}`}>{inc.title}</h4>
                          <p className={`text-[11px] mt-0.5 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>{inc.description}</p>
                        </div>

                        <div className={`mt-3 pt-2 border-t flex justify-between items-center text-[10px] ${
                          isHighContrast ? "border-white" : "border-slate-200/80"
                        }`}>
                          <span className={`font-mono ${isHighContrast ? "text-slate-400" : "text-slate-500"}`}>Location: {inc.location}</span>
                          <span className={`font-bold ${isHighContrast ? "text-white font-mono" : "text-indigo-600"}`}>{inc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operations commander executive report */}
              <div className={`border rounded-2xl p-6 shadow-sm ${
                isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>AI-Generated Venue Situational report (SITREP)</h3>
                    <p className={`text-xs mt-1 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                      Instantly compile raw active incidents, security alerts, and waste sorting metrics into an executive briefing document.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateSitrep}
                    disabled={aiLoading}
                    className={`text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      isHighContrast
                        ? "bg-white text-black hover:bg-slate-200 border border-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Compile SITREP Briefing"}
                  </button>
                </div>

                {sitrepOutput && (
                  <div className={`mt-4 p-4 border rounded-xl leading-relaxed text-xs ${
                    isHighContrast ? "bg-black border-white text-white" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <div className="markdown-body text-slate-700 prose prose-invert">
                      {/* Formatted output summary */}
                      <pre className={`whitespace-pre-wrap font-sans text-xs ${isHighContrast ? "text-slate-200" : "text-slate-700"}`}>
                        {sitrepOutput}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Dynamic AI Companion Terminal Panel */}
        <div className={`border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-fit relative transition-all duration-300 ${
          isHighContrast ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-850 shadow-sm"
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className={`h-5 w-5 animate-pulse ${isHighContrast ? "text-white" : "text-indigo-600"}`} />
              <h3 className={`text-base font-bold ${isHighContrast ? "text-white" : "text-slate-900"}`}>AI Stadium Companion Terminal</h3>
            </div>
            
            <p className={`text-xs mb-4 leading-relaxed ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
              Equipped with server-side proxy security rules, this assistant utilizes the powerful **Gemini 2.5 Flash** model to answer match guidelines, stadium seating structures, thermal comfort directives, and ticketing terms.
            </p>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {chatResponse ? (
                <div className={`border p-4 rounded-xl leading-relaxed text-xs shadow-sm ${
                  isHighContrast ? "bg-black border-white text-white" : "bg-indigo-50/50 border-indigo-100/60 text-slate-800"
                }`}>
                  <div className="markdown-body font-sans text-xs">
                    <pre className={`whitespace-pre-wrap font-sans ${isHighContrast ? "text-slate-300" : "text-slate-700"}`}>{chatResponse}</pre>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 text-xs border border-dashed rounded-xl ${
                  isHighContrast ? "border-white text-slate-400" : "border-slate-200 text-slate-400 bg-slate-50/50"
                }`}>
                  Type a custom stadium question below to begin conversation...
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleChatSubmit} className={`mt-6 pt-4 border-t ${isHighContrast ? "border-white" : "border-slate-100"}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about the stadium..."
                className={`flex-1 rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                  isHighContrast 
                    ? "bg-black border-white text-white placeholder-slate-400" 
                    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"
                }`}
              />
              <button
                type="submit"
                disabled={aiLoading}
                className={`text-xs font-bold p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isHighContrast
                    ? "bg-white text-black hover:bg-slate-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                }`}
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
