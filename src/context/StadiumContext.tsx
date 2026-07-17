/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  MatchInfo,
  RestroomStatus,
  FoodStandStatus,
  IncidentReport,
  VolunteerTask,
  StadiumNode,
  LostFoundItem,
  SustainabilityMetric,
} from "../types";

interface StadiumContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  matches: MatchInfo[];
  setMatches: React.Dispatch<React.SetStateAction<MatchInfo[]>>;
  restrooms: RestroomStatus[];
  setRestrooms: React.Dispatch<React.SetStateAction<RestroomStatus[]>>;
  foodStands: FoodStandStatus[];
  setFoodStands: React.Dispatch<React.SetStateAction<FoodStandStatus[]>>;
  incidents: IncidentReport[];
  setIncidents: React.Dispatch<React.SetStateAction<IncidentReport[]>>;
  tasks: VolunteerTask[];
  setTasks: React.Dispatch<React.SetStateAction<VolunteerTask[]>>;
  stadiumNodes: StadiumNode[];
  setStadiumNodes: React.Dispatch<React.SetStateAction<StadiumNode[]>>;
  lostFoundItems: LostFoundItem[];
  setLostFoundItems: React.Dispatch<React.SetStateAction<LostFoundItem[]>>;
  sustainability: SustainabilityMetric;
  setSustainability: React.Dispatch<React.SetStateAction<SustainabilityMetric>>;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isHighContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
  textScale: number; // 1.0, 1.2, 1.4
  setTextScale: (val: number) => void;
  isEvacuationActive: boolean;
  setEvacuationActive: (val: boolean) => void;
  evacuationInstruction: string;
  setEvacuationInstruction: (val: string) => void;
}

const StadiumContext = createContext<StadiumContextType | undefined>(undefined);

// Initial Static Data (World Cup 2026 Dallas/Arlington AT&T Stadium simulation)
const INITIAL_MATCHES: MatchInfo[] = [
  {
    id: "m1",
    homeTeam: "United States",
    awayTeam: "Germany",
    homeFlag: "🇺🇸",
    awayFlag: "🇩🇪",
    date: "2026-07-17",
    time: "19:00",
    stage: "Quarter-Final",
    stadium: "Dallas Stadium (Arlington)",
    status: "LIVE",
    score: { home: 1, away: 0 },
  },
  {
    id: "m2",
    homeTeam: "Mexico",
    awayTeam: "Argentina",
    homeFlag: "🇲🇽",
    awayFlag: "🇦🇷",
    date: "2026-07-18",
    time: "20:00",
    stage: "Quarter-Final",
    stadium: "Dallas Stadium (Arlington)",
    status: "UPCOMING",
  },
  {
    id: "m3",
    homeTeam: "Canada",
    awayTeam: "France",
    homeFlag: "🇨🇦",
    awayFlag: "🇫🇷",
    date: "2026-07-19",
    time: "18:00",
    stage: "Quarter-Final",
    stadium: "Dallas Stadium (Arlington)",
    status: "UPCOMING",
  }
];

const INITIAL_RESTROOMS: RestroomStatus[] = [
  { id: "r1", level: "L1", gender: "ACCESSIBLE", proximitySection: "Section 102", status: "NORMAL", waitTimeMinutes: 2, occupancyPercent: 30, waterSavedGallons: 1240 },
  { id: "r2", level: "L1", gender: "MEN", proximitySection: "Section 104", status: "CONGESTED", waitTimeMinutes: 12, occupancyPercent: 85, waterSavedGallons: 980 },
  { id: "r3", level: "L1", gender: "WOMEN", proximitySection: "Section 105", status: "CRITICAL", waitTimeMinutes: 18, occupancyPercent: 98, waterSavedGallons: 1560 },
  { id: "r4", level: "L2", gender: "WOMEN", proximitySection: "Section 210", status: "NORMAL", waitTimeMinutes: 3, occupancyPercent: 40, waterSavedGallons: 2110 },
  { id: "r5", level: "L2", gender: "MEN", proximitySection: "Section 212", status: "NORMAL", waitTimeMinutes: 1, occupancyPercent: 20, waterSavedGallons: 1730 },
  { id: "r6", level: "L2", gender: "ACCESSIBLE", proximitySection: "Section 215", status: "NORMAL", waitTimeMinutes: 1, occupancyPercent: 15, waterSavedGallons: 840 }
];

const INITIAL_FOOD_STANDS: FoodStandStatus[] = [
  { id: "f1", name: "Star Spangled Burgers", level: "L1", proximitySection: "Section 101", cuisine: "American", waitTimeMinutes: 15, status: "CONGESTED", sustainabilityRating: 4, isQueueAware: true, specials: ["Lone Star Triple Stack", "Impossible Texan Burger"] },
  { id: "f2", name: "El Tri Taco Express", level: "L1", proximitySection: "Section 108", cuisine: "Mexican", waitTimeMinutes: 4, status: "NORMAL", sustainabilityRating: 5, isQueueAware: true, specials: ["Campechano Tacos", "Agua Fresca de Hibiscus"] },
  { id: "f3", name: "Maple Leaf Poutine & Grill", level: "L2", proximitySection: "Section 204", cuisine: "Canadian", waitTimeMinutes: 22, status: "CRITICAL", sustainabilityRating: 3, isQueueAware: true, specials: ["Quebec Curd Poutine", "Maple Glazed Ribs"] },
  { id: "f4", name: "Bratwurst & Beer Arena", level: "L2", proximitySection: "Section 220", cuisine: "German", waitTimeMinutes: 5, status: "NORMAL", sustainabilityRating: 4, isQueueAware: true, specials: ["Giant Arena Bratwurst", "Zero-Alcohol Weizen"] }
];

const INITIAL_INCIDENTS: IncidentReport[] = [
  { id: "inc1", title: "Minor Beverage Spill", description: "Slippery hazard at Section 104, Row K.", location: "Section 104", severity: "LOW", status: "REPORTED", category: "MAINTENANCE", reportedAt: "2026-07-17T19:15:00-07:00" },
  { id: "inc2", title: "Heat Exhaustion Response", description: "Elderly fan feeling dizzy due to high indoor summer humidity near Section 105.", location: "Section 105", severity: "HIGH", status: "DISPATCHED", category: "MEDICAL", reportedAt: "2026-07-17T19:22:00-07:00", assignedVolunteerId: "v1" },
  { id: "inc3", title: "Gate C Barrier Congestion", description: "Elevated crowd bottleneck slowing security entry lanes.", location: "Gate C", severity: "MEDIUM", status: "REPORTED", category: " crowd_control", reportedAt: "2026-07-17T19:28:00-07:00" }
];

const INITIAL_TASKS: VolunteerTask[] = [
  { id: "t1", title: "Direct Fan Flow at Gate C", description: "Assist security staff in distributing fans across empty metal detector arches.", location: "Gate C", assignedToId: "v1", status: "IN_PROGRESS", createdAt: "2026-07-17T19:00:00-07:00", severity: "MEDIUM" },
  { id: "t2", title: "Deliver Hydration Packs", description: "Provide electrolyte drinks to active standby medical unit at Section 105.", location: "Section 105", assignedToId: "v1", status: "PENDING", createdAt: "2026-07-17T19:23:00-07:00", severity: "HIGH" }
];

const INITIAL_NODES: StadiumNode[] = [
  { id: "gate_a", name: "Gate A (Main North Entry)", type: "GATE", x: 50, y: 5, crowdDensity: 45, avgWaitTimeMinutes: 10 },
  { id: "gate_b", name: "Gate B (East Hub)", type: "GATE", x: 95, y: 50, crowdDensity: 80, avgWaitTimeMinutes: 25 },
  { id: "gate_c", name: "Gate C (South Transit Loop)", type: "GATE", x: 50, y: 95, crowdDensity: 88, avgWaitTimeMinutes: 28 },
  { id: "gate_d", name: "Gate D (West RideShare)", type: "GATE", x: 5, y: 50, crowdDensity: 20, avgWaitTimeMinutes: 4 },
  
  { id: "conc_n", name: "Concourse North (Section 101-105)", type: "CONCOURSE", x: 50, y: 25, crowdDensity: 75 },
  { id: "conc_e", name: "Concourse East (Section 106-112)", type: "CONCOURSE", x: 75, y: 50, crowdDensity: 50 },
  { id: "conc_s", name: "Concourse South (Section 113-118)", type: "CONCOURSE", x: 50, y: 75, crowdDensity: 92 },
  { id: "conc_w", name: "Concourse West (Section 119-125)", type: "CONCOURSE", x: 25, y: 50, crowdDensity: 30 },

  { id: "med_1", name: "Main Emergency Medical Clinic", type: "MEDICAL", x: 25, y: 25, crowdDensity: 15, avgWaitTimeMinutes: 0 },
  { id: "med_2", name: "Secondary Medical Aid Point", type: "MEDICAL", x: 75, y: 75, crowdDensity: 40, avgWaitTimeMinutes: 5 },

  { id: "transit_hub", name: "Arlington Rail & Shuttle Terminal", type: "TRANSIT", x: 50, y: 105, crowdDensity: 85, avgWaitTimeMinutes: 15 }
];

const INITIAL_LOST_ITEMS: LostFoundItem[] = [
  { id: "l1", title: "Black Leather Tri-fold Wallet", description: "Contains credit card and US driver's license. Left at Row G, Seat 12.", category: "Personal Document", color: "Black", locationLost: "Section 104", status: "LOST", createdAt: "2026-07-17T18:45:00-07:00" },
  { id: "l2", title: "Silver iPhone 15 Pro", description: "Clear case, lockscreen shows a golden retriever dog.", category: "Electronics", color: "Silver", locationLost: "Section 110", status: "FOUND", createdAt: "2026-07-17T19:05:00-07:00" },
  { id: "l3", title: "Official FIFA 2026 Matchball replica", description: "Signed by local fans.", category: "Sports Gear", color: "Multi-color", locationLost: "Gate B", status: "FOUND", createdAt: "2026-07-17T19:12:00-07:00" }
];

export const StadiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load state from localStorage or fallback to defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("arena_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: "v1", // Simulated Volunteer/Fan account
          name: "Alex Thorne",
          email: "alex.thorne@stadium-ops.fifa.org",
          role: UserRole.FAN, // Start as FAN, can toggle roles
          language: "English",
          ticketSection: "Section 104",
          ticketSeat: "Row K, Seat 14",
          greenScore: 85,
        };
  });

  const [matches, setMatches] = useState<MatchInfo[]>(() => {
    const saved = localStorage.getItem("arena_matches");
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [restrooms, setRestrooms] = useState<RestroomStatus[]>(() => {
    const saved = localStorage.getItem("arena_restrooms");
    return saved ? JSON.parse(saved) : INITIAL_RESTROOMS;
  });

  const [foodStands, setFoodStands] = useState<FoodStandStatus[]>(() => {
    const saved = localStorage.getItem("arena_foodstands");
    return saved ? JSON.parse(saved) : INITIAL_FOOD_STANDS;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem("arena_incidents");
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [tasks, setTasks] = useState<VolunteerTask[]>(() => {
    const saved = localStorage.getItem("arena_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [stadiumNodes, setStadiumNodes] = useState<StadiumNode[]>(() => {
    const saved = localStorage.getItem("arena_nodes");
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => {
    const saved = localStorage.getItem("arena_lost_found");
    return saved ? JSON.parse(saved) : INITIAL_LOST_ITEMS;
  });

  const [sustainability, setSustainability] = useState<SustainabilityMetric>(() => {
    const saved = localStorage.getItem("arena_sustainability");
    return saved
      ? JSON.parse(saved)
      : {
          totalWasteRecycledKg: 4280,
          totalWaterSavedGallons: 8430,
          publicTransitTrips: 18450,
          activeGreenUsers: 1420,
        };
  });

  // UI state
  const [currentLanguage, setLanguage] = useState(() => localStorage.getItem("arena_lang") || "English");
  const [isHighContrast, setHighContrast] = useState(() => localStorage.getItem("arena_high_contrast") === "true");
  const [isDarkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("arena_dark_mode");
    return saved ? saved === "true" : false; // default to light mode
  });
  const [textScale, setTextScale] = useState(() => parseFloat(localStorage.getItem("arena_text_scale") || "1.0"));
  const [isEvacuationActive, setEvacuationActive] = useState(false);
  const [evacuationInstruction, setEvacuationInstruction] = useState("");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("arena_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("arena_matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("arena_restrooms", JSON.stringify(restrooms));
  }, [restrooms]);

  useEffect(() => {
    localStorage.setItem("arena_foodstands", JSON.stringify(foodStands));
  }, [foodStands]);

  useEffect(() => {
    localStorage.setItem("arena_incidents", JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem("arena_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("arena_nodes", JSON.stringify(stadiumNodes));
  }, [stadiumNodes]);

  useEffect(() => {
    localStorage.setItem("arena_lost_found", JSON.stringify(lostFoundItems));
  }, [lostFoundItems]);

  useEffect(() => {
    localStorage.setItem("arena_sustainability", JSON.stringify(sustainability));
  }, [sustainability]);

  useEffect(() => {
    localStorage.setItem("arena_lang", currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem("arena_high_contrast", String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem("arena_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("arena_text_scale", String(textScale));
  }, [textScale]);

  return (
    <StadiumContext.Provider
      value={{
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
        stadiumNodes,
        setStadiumNodes,
        lostFoundItems,
        setLostFoundItems,
        sustainability,
        setSustainability,
        currentLanguage,
        setLanguage,
        isHighContrast,
        setHighContrast,
        isDarkMode,
        setDarkMode,
        textScale,
        setTextScale,
        isEvacuationActive,
        setEvacuationActive,
        evacuationInstruction,
        setEvacuationInstruction,
      }}
    >
      {children}
    </StadiumContext.Provider>
  );
};

export const useStadium = () => {
  const context = useContext(StadiumContext);
  if (!context) {
    throw new Error("useStadium must be used within a StadiumProvider");
  }
  return context;
};
