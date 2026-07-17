/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useStadium } from "../context/StadiumContext";
import { StadiumNode } from "../types";
import { Info, MapPin, Navigation, Eye, AlertTriangle } from "lucide-react";

export const StadiumMap: React.FC = () => {
  const {
    stadiumNodes,
    restrooms,
    foodStands,
    currentUser,
    isEvacuationActive,
    isHighContrast,
    isDarkMode,
  } = useStadium();

  const [selectedNode, setSelectedNode] = useState<StadiumNode | null>(null);
  const [navigationPath, setNavigationPath] = useState<string[] | null>(null);

  // Simple Dijkstra/BFS-style mock pathfinding for the SVG nodes
  const calculatePath = (targetNodeId: string) => {
    // We mock pathfinding from the fan's assumed section "Section 104" (which correlates to Concourse North "conc_n")
    const startNodeId = "conc_n";
    if (startNodeId === targetNodeId) {
      setNavigationPath([startNodeId]);
      return;
    }

    // Connect nodes into a mock graph structure
    // conc_n connects to conc_e, conc_w, gate_a, med_1
    // conc_s connects to conc_e, conc_w, gate_c, transit_hub, med_2
    // conc_e connects to gate_b
    // conc_w connects to gate_d
    const path: string[] = [startNodeId];
    if (targetNodeId.startsWith("gate_a") || targetNodeId.startsWith("med_1")) {
      path.push(targetNodeId);
    } else if (targetNodeId.startsWith("gate_d")) {
      path.push("conc_w", targetNodeId);
    } else if (targetNodeId.startsWith("gate_b")) {
      path.push("conc_e", targetNodeId);
    } else if (targetNodeId.startsWith("gate_c") || targetNodeId.startsWith("transit_hub") || targetNodeId.startsWith("med_2")) {
      path.push("conc_s", targetNodeId);
    } else {
      path.push("conc_s", targetNodeId); // fallback
    }

    setNavigationPath(path);
  };

  const getNodeColor = (node: StadiumNode) => {
    if (isHighContrast) {
      if (node.crowdDensity > 80) return "#ffffff"; // White for contrast
      if (node.crowdDensity > 50) return "#94a3b8"; // Light Gray
      return "#0f172a"; // Deep Slate
    }

    // Dynamic color gradient based on density
    if (node.crowdDensity > 80) return "#ef4444"; // Red (Critical)
    if (node.crowdDensity > 50) return "#f59e0b"; // Orange (Congested)
    return "#10b981"; // Green (Optimal)
  };

  const getCoordinates = (nodeId: string) => {
    const node = stadiumNodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
  };

  return (
    <div className={`border rounded-2xl p-6 shadow-sm overflow-hidden relative transition-all duration-300 ${
      isHighContrast 
        ? "bg-black border-white text-white" 
        : isDarkMode
        ? "bg-slate-900 border-slate-800 text-slate-100 shadow-md"
        : "bg-white border-slate-200 text-slate-900 shadow-sm"
    }`} id="stadium-map-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 tracking-tight ${
            isHighContrast ? "text-white" : isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            <Navigation className={`h-5 w-5 animate-pulse ${isHighContrast ? "text-white" : "text-indigo-400"}`} />
            Arena AI Live Heatmap & Interactive Navigation
          </h2>
          <p className={`text-sm mt-1 ${isHighContrast ? "text-slate-300" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Click any gate, service point, or concourse node to calculate real-time, queue-aware routing.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            <span className={isHighContrast ? "text-white" : isDarkMode ? "text-slate-300" : "text-slate-600"}>Normal (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
            <span className={isHighContrast ? "text-white" : isDarkMode ? "text-slate-300" : "text-slate-600"}>Congested (50-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
            <span className={isHighContrast ? "text-white" : isDarkMode ? "text-slate-300" : "text-slate-600"}>Critical (&gt;80%)</span>
          </div>
        </div>
      </div>

      {isEvacuationActive && (
        <div className="mb-6 p-4 bg-red-950/80 border-2 border-red-500 text-red-200 rounded-xl flex items-center gap-3 animate-pulse">
          <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
          <div>
            <strong className="block text-sm uppercase tracking-wide text-red-400 font-bold">EMERGENCY DRILL ACTIVE</strong>
            <p className="text-xs mt-0.5">Dynamic evacuation pathing overlay active. Follow green routes to secure external assemblies immediately.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Canvas */}
        <div className={`lg:col-span-2 relative rounded-xl p-4 flex justify-center items-center h-[380px] sm:h-[440px] border ${
          isHighContrast ? "bg-black border-white" : "bg-slate-950 border-slate-800/60 shadow-inner"
        }`}>
          {/* Main Stadium Outer Boundary Outline */}
          <svg
            viewBox="0 0 100 110"
            className="w-full h-full max-w-[420px] select-none"
            aria-label="Interactive Stadium Vector Map Layout"
            role="img"
          >
            {/* Background grids for high-fidelity look */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Stadium Pitch Center Outline */}
            <rect x="35" y="38" width="30" height="24" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
            <line x1="50" y1="38" x2="50" y2="62" stroke="#334155" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" fill="none" stroke="#334155" strokeWidth="1" />

            {/* Pathfinding Connection Wireframes */}
            <path
              d="M 50,25 L 75,50 L 50,75 L 25,50 Z"
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* Node connectors */}
            <line x1="50" y1="5" x2="50" y2="25" stroke="#1e293b" strokeWidth="0.75" />
            <line x1="95" y1="50" x2="75" y2="50" stroke="#1e293b" strokeWidth="0.75" />
            <line x1="50" y1="95" x2="50" y2="75" stroke="#1e293b" strokeWidth="0.75" />
            <line x1="5" y1="50" x2="25" y2="50" stroke="#1e293b" strokeWidth="0.75" />
            <line x1="50" y1="95" x2="50" y2="105" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="1,1" />

            {/* Active Navigation Polyline Route */}
            {navigationPath && navigationPath.length > 1 && (
              <polyline
                points={navigationPath
                  .map((nodeId) => {
                    const coord = getCoordinates(nodeId);
                    return `${coord.x},${coord.y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke={isEvacuationActive ? "#ef4444" : "#10b981"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[dash_2s_linear_infinite]"
                style={{
                  strokeDasharray: "4,4",
                }}
              />
            )}

            {/* Crowd Nodes */}
            {stadiumNodes.map((node) => {
              const color = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              const isNavNode = navigationPath?.includes(node.id);

              return (
                <g key={node.id} className="cursor-pointer" onClick={() => { setSelectedNode(node); calculatePath(node.id); }}>
                  {/* Outer breathing ring for selected or navigation-related nodes */}
                  {(isSelected || isNavNode) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.type === "GATE" || node.type === "TRANSIT" ? "4.5" : "3.5"}
                      fill="none"
                      stroke={isSelected ? "#3b82f6" : "#10b981"}
                      strokeWidth="1.2"
                      className="animate-ping"
                      style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "1.8s" }}
                    />
                  )}

                  {/* Core Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === "GATE" || node.type === "TRANSIT" ? "3" : "2"}
                    fill={color}
                    stroke={isSelected ? "#3b82f6" : "#1e293b"}
                    strokeWidth="0.75"
                  />

                  {/* Accessible elevator icon marker if node is near sensory medical */}
                  {node.id === "med_1" && (
                    <circle cx={node.x} cy={node.y} r="0.8" fill="#ffffff" />
                  )}

                  {/* Quick textual labels for key entry points */}
                  {(node.type === "GATE" || node.type === "TRANSIT") && (
                    <text
                      x={node.x}
                      y={node.y - 4}
                      fill="#94a3b8"
                      fontSize="2.2"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      className="font-semibold select-none"
                    >
                      {node.name.split(" ")[0]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Fan's current location indicator blinking flag */}
            <g>
              {/* Proximity mapping Section 104 is located roughly around Concourse North (x:50, y:25) */}
              <circle cx="50" cy="23" r="1.5" fill="#3b82f6" className="animate-bounce" />
              <circle cx="50" cy="23" r="3" fill="none" stroke="#3b82f6" strokeWidth="0.5" className="animate-ping" style={{ transformOrigin: "50px 23px" }} />
              <text x="50" y="19" fill="#3b82f6" fontSize="2" fontFamily="Inter, sans-serif" fontWeight="bold" textAnchor="middle">
                YOU (S104)
              </text>
            </g>
          </svg>

          {/* Floater overlay instruction info */}
          <div className={`absolute bottom-3 left-3 backdrop-blur-md border rounded-lg py-1.5 px-3 text-[10px] font-mono shadow-sm ${
            isHighContrast ? "bg-black border-white text-white" : "bg-slate-900/95 border-slate-850 text-slate-200"
          }`}>
            Blue indicator shows your current location: <strong className={isHighContrast ? "text-white underline font-bold" : "text-blue-400"}>Section 104</strong>
          </div>
        </div>

        {/* Node Detail Panel / Routing Card */}
        <div className="flex flex-col justify-between">
          <div className={`border rounded-xl p-5 flex-1 flex flex-col justify-between shadow-sm ${
            isHighContrast ? "bg-black border-white text-white" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            {selectedNode ? (
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full block shrink-0"
                      style={{ backgroundColor: getNodeColor(selectedNode) }}
                    ></span>
                    <h3 className={`text-base font-bold tracking-tight leading-tight ${isHighContrast ? "text-white" : "text-slate-900"}`}>
                      {selectedNode.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono py-0.5 px-2 rounded-full uppercase border ${
                    isHighContrast ? "bg-black border-white text-white" : "bg-slate-200 border-slate-300 text-slate-700"
                  }`}>
                    {selectedNode.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-white" : "text-slate-500"}`}>Crowd Safety Density</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex-1 rounded-full h-2 overflow-hidden ${isHighContrast ? "bg-slate-700" : "bg-slate-200"}`}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedNode.crowdDensity}%`,
                            backgroundColor: getNodeColor(selectedNode),
                          }}
                        ></div>
                      </div>
                      <span className={`text-xs font-mono font-bold ${isHighContrast ? "text-white" : "text-slate-700"}`}>{selectedNode.crowdDensity}%</span>
                    </div>
                  </div>

                  {selectedNode.avgWaitTimeMinutes !== undefined && (
                    <div className={`border rounded-xl p-3 ${isHighContrast ? "bg-black border-white" : "bg-white border-slate-200/60 shadow-sm"}`}>
                      <span className={`text-[10px] font-mono block uppercase ${isHighContrast ? "text-white" : "text-slate-400"}`}>Estimated Wait Time</span>
                      <span className={`text-lg font-bold mt-1 block ${isHighContrast ? "text-white" : "text-slate-800 font-mono"}`}>
                        {selectedNode.avgWaitTimeMinutes} mins
                      </span>
                      <p className={`text-[11px] mt-1 ${isHighContrast ? "text-slate-300" : "text-slate-500"}`}>
                        {selectedNode.avgWaitTimeMinutes > 15
                          ? "⚠️ High delay. We recommend navigating to another gate."
                          : "✅ Quick flow. Proceed through normal security lines."}
                      </p>
                    </div>
                  )}

                  {/* Tailored recommendations linked to the selected node */}
                  {selectedNode.id === "gate_b" && (
                    <div className={`border rounded-lg p-3 text-xs ${
                      isHighContrast ? "bg-black border-white text-white" : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>
                      <strong>💡 Smart Alternate Option:</strong> Gate D (Rideshare) is currently empty with only a 4-minute wait time. Redirecting there saves up to 21 minutes.
                    </div>
                  )}

                  {selectedNode.id === "gate_c" && (
                    <div className={`border rounded-lg p-3 text-xs ${
                      isHighContrast ? "bg-black border-white text-white" : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                      <strong>⚠️ Severe Bottleneck:</strong> Rail transit passengers arriving at the South hub are causing major backlog. Security gates A and D are faster alternates.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                <Info className={`h-10 w-10 mb-3 animate-pulse ${isHighContrast ? "text-white" : "text-slate-300"}`} />
                <h3 className={`text-sm font-bold ${isHighContrast ? "text-white" : "text-slate-400"}`}>No Target Point Selected</h3>
                <p className={`text-xs mt-1 max-w-[180px] ${isHighContrast ? "text-slate-300" : "text-slate-400"}`}>
                  Click on any node on the stadium map to generate smart routing directions.
                </p>
              </div>
            )}

            {/* Navigation Summary */}
            {navigationPath && selectedNode && (
              <div className={`mt-4 pt-4 border-t ${isHighContrast ? "border-white" : "border-slate-200"}`}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold font-mono ${isHighContrast ? "text-white" : "text-indigo-600"}`}>
                  <MapPin className="h-3.5 w-3.5" />
                  AI ROUTING GENERATED
                </div>
                <div className={`text-[11px] space-y-1 ${isHighContrast ? "text-white" : "text-slate-600"}`}>
                  <div>
                    <strong>Route:</strong> Section 104 →{" "}
                    {navigationPath
                      .slice(1)
                      .map((id) => {
                        const node = stadiumNodes.find((n) => n.id === id);
                        return node ? node.name.split(" ")[0] : id;
                      })
                      .join(" → ")}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-400">
                    Est. Transit walk time: ~3 mins
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
