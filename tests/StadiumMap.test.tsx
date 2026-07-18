import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { StadiumProvider } from "../src/context/StadiumContext";
import { StadiumMap } from "../src/components/StadiumMap";

describe("StadiumMap Component", () => {
  test("renders the interactive stadium SVG heatmap with correct headings", () => {
    render(
      <StadiumProvider>
        <StadiumMap />
      </StadiumProvider>
    );

    // Verify map headers
    expect(screen.getByText(/Live Heatmap & Interactive Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Click any gate, service point, or concourse/i)).toBeInTheDocument();

    // Verify SVG layout exists via its role & accessible name
    const svgMap = screen.getByRole("img", { name: /Interactive Stadium Vector Map Layout/i });
    expect(svgMap).toBeInTheDocument();
  });

  test("renders the map legend properly", () => {
    render(
      <StadiumProvider>
        <StadiumMap />
      </StadiumProvider>
    );

    expect(screen.getByText(/Normal \(<50%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Congested \(50-80%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical \(>80%\)/i)).toBeInTheDocument();
  });

  test("displays No Target Point Selected initially", () => {
    render(
      <StadiumProvider>
        <StadiumMap />
      </StadiumProvider>
    );

    // Default unselected message
    expect(screen.getByText(/No Target Point Selected/i)).toBeInTheDocument();
    expect(screen.getByText(/Click on any node on the stadium map to generate smart routing directions/i)).toBeInTheDocument();
  });
});
