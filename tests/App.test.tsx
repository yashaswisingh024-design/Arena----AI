import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import App from "../src/App";

describe("App Root Component", () => {
  test("renders the full layout with header, map, and footer", () => {
    render(<App />);

    // Verify upper tactical bar
    expect(screen.getByText(/FIFA World Cup Host Command Link: ONLINE/i)).toBeInTheDocument();

    // Verify main header title
    expect(screen.getByText(/ARENA AI – Smart Stadium Intelligence Platform/i)).toBeInTheDocument();

    // Verify map section exists
    expect(screen.getByText(/Live Heatmap & Interactive Navigation/i)).toBeInTheDocument();

    // Verify footer exists
    expect(screen.getByText(/FIFA World Cup Tournament Operations Group/i)).toBeInTheDocument();
  });

  test("toggles light/dark mode on clicking the theme button", () => {
    render(<App />);

    const themeButton = screen.getByRole("button", { name: /Switch to Dark Mode/i });
    expect(themeButton).toBeInTheDocument();

    // Trigger click
    fireEvent.click(themeButton);
    
    // Theme icon/text changes
    expect(screen.getByRole("button", { name: /Switch to Light Mode/i })).toBeInTheDocument();
  });

  test("allows selecting a different global language", () => {
    render(<App />);

    const select = screen.getByRole("combobox", { name: /Select Preferred Interface Language/i });
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "Spanish" } });
    expect(select).toHaveValue("Spanish");
  });
});
