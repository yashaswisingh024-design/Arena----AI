/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  FAN = "FAN",
  VOLUNTEER = "VOLUNTEER",
  STAFF = "STAFF"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: string;
  ticketSection?: string;
  ticketSeat?: string;
  greenScore: number;
}

export interface MatchInfo {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
  stage: string;
  stadium: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  score?: { home: number; away: number };
}

export interface RestroomStatus {
  id: string;
  level: string;
  gender: "MEN" | "WOMEN" | "ACCESSIBLE" | "FAMILY";
  proximitySection: string;
  status: "NORMAL" | "CONGESTED" | "CRITICAL";
  waitTimeMinutes: number;
  occupancyPercent: number;
  waterSavedGallons: number;
}

export interface FoodStandStatus {
  id: string;
  name: string;
  level: string;
  proximitySection: string;
  cuisine: string;
  waitTimeMinutes: number;
  status: "NORMAL" | "CONGESTED" | "CRITICAL";
  sustainabilityRating: number; // 1-5
  isQueueAware: boolean;
  specials: string[];
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  location: string; // e.g. "Section 104", "Gate B"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "REPORTED" | "DISPATCHED" | "RESOLVED";
  reportedAt: string;
  category: "MEDICAL" | "SECURITY" | "MAINTENANCE" | " crowd_control";
  assignedVolunteerId?: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  location: string;
  assignedToId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface StadiumNode {
  id: string;
  name: string;
  type: "GATE" | "CONCOURSE" | "STAND" | "RESTROOM" | "MEDICAL" | "TRANSIT";
  x: number; // 0 - 100 for SVG positioning
  y: number; // 0 - 100
  crowdDensity: number; // 0 - 100
  avgWaitTimeMinutes?: number;
}

export interface EvacuationRoute {
  sourceNodeId: string;
  pathNodes: string[]; // sequence of Node IDs to follow
  instructions: string[];
  safeAssemblyArea: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  locationLost: string;
  status: "LOST" | "FOUND" | "CLAIMED";
  imageUrl?: string;
  createdAt: string;
}

export interface SustainabilityMetric {
  totalWasteRecycledKg: number;
  totalWaterSavedGallons: number;
  publicTransitTrips: number;
  activeGreenUsers: number;
}
