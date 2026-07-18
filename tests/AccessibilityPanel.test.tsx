import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { StadiumProvider } from "../src/context/StadiumContext";
import { AccessibilityPanel } from "../src/components/AccessibilityPanel";

describe("AccessibilityPanel Component", () => {
  test("renders the accessibility guidance hub with correct headings", () => {
    render(
      <StadiumProvider>
        <AccessibilityPanel />
      </StadiumProvider>
    );

    // Verify main headings
    expect(screen.getByText(/AI Accessibility Guidance Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Reader Size Adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/Audio Assist & Speech Synthesis/i)).toBeInTheDocument();
    expect(screen.getByText(/Sensory Alerts & Rescues/i)).toBeInTheDocument();
  });

  test("allows triggering sensory alerts / rescue beacon", () => {
    render(
      <StadiumProvider>
        <AccessibilityPanel />
      </StadiumProvider>
    );

    const beaconButton = screen.getByRole("button", { name: /TRIGGER ACCESSIBLE RESCUE BEACON/i });
    expect(beaconButton).toBeInTheDocument();

    // Trigger beacon click
    fireEvent.click(beaconButton);
    expect(screen.getByText(/Staff GPS Tracking Active/i)).toBeInTheDocument();
  });

  test("supports text scaling selection", () => {
    render(
      <StadiumProvider>
        <AccessibilityPanel />
      </StadiumProvider>
    );

    const largeBtn = screen.getByRole("button", { name: /Large \(1.2x\)/i });
    const maxBtn = screen.getByRole("button", { name: /Max \(1.4x\)/i });

    expect(largeBtn).toBeInTheDocument();
    expect(maxBtn).toBeInTheDocument();
  });

  test("renders accessible amenities checklist", () => {
    render(
      <StadiumProvider>
        <AccessibilityPanel />
      </StadiumProvider>
    );

    expect(screen.getByText(/Elevator B \(Direct section 104 access\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiet Sensory Room/i)).toBeInTheDocument();
  });
});
