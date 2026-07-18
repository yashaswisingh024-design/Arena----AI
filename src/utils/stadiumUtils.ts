/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getCrowdDensityLevel(density: number): "NORMAL" | "CONGESTED" | "CRITICAL" {
  if (density < 50) return "NORMAL";
  if (density < 85) return "CONGESTED";
  return "CRITICAL";
}

export function calculateGreenScoreBonus(transitTrips: number): number {
  if (transitTrips <= 0) return 0;
  if (transitTrips < 5) return 5;
  if (transitTrips < 10) return 15;
  return 30;
}

export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) return "No wait";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
}

export function getSeverityColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "text-red-600 bg-red-100 dark:bg-red-950/40 dark:text-red-400";
    case "HIGH":
      return "text-orange-600 bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-400";
    default:
      return "text-green-600 bg-green-100 dark:bg-green-950/40 dark:text-green-400";
  }
}
