import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { StadiumProvider } from "../src/context/StadiumContext";
import { Dashboards } from "../src/components/Dashboards";

describe("Dashboards Component", () => {
  test("renders the multi-perspective command deck", () => {
    render(
      <StadiumProvider>
        <Dashboards />
      </StadiumProvider>
    );

    // Verify main header
    expect(screen.getByText(/Toggle Simulation Persona/i)).toBeInTheDocument();
  });

  test("toggles between Fan, Volunteer, and Staff tabs", () => {
    render(
      <StadiumProvider>
        <Dashboards />
      </StadiumProvider>
    );

    // Initial view should be Fan Perspective
    expect(screen.getByText(/Alex Thorne's Seat Pass/i)).toBeInTheDocument(); // Fan pass
    expect(screen.getByText(/Your Green Score/i)).toBeInTheDocument();

    // Toggle to Volunteer View
    const volunteerTab = screen.getByRole("button", { name: /Volunteer Hub/i });
    expect(volunteerTab).toBeInTheDocument();
    fireEvent.click(volunteerTab);

    expect(screen.getByText(/Your Active Volunteer Shift/i)).toBeInTheDocument();

    // Toggle to Staff View
    const staffTab = screen.getByRole("button", { name: /Operations Cmd/i });
    expect(staffTab).toBeInTheDocument();
    fireEvent.click(staffTab);

    // Verify Staff specific text
    expect(screen.getAllByText(/SITREP/i).length).toBeGreaterThan(0);
  });

  test("allows fan to search Lost & Found", () => {
    render(
      <StadiumProvider>
        <Dashboards />
      </StadiumProvider>
    );

    // We are on Fan View by default
    const lostInput = screen.getByPlaceholderText(/Enter item color, shape, materials/i);
    expect(lostInput).toBeInTheDocument();

    fireEvent.change(lostInput, { target: { value: "iPhone" } });
    expect(lostInput).toHaveValue("iPhone");

    const searchBtn = screen.getByRole("button", { name: /Search Lost Items/i });
    expect(searchBtn).toBeInTheDocument();
  });
});
