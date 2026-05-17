import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stat } from "./Stat";

describe("Stat", () => {
  it("renders label and value", () => {
    render(<Stat label="Revenue" value="$12,840" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12,840")).toBeInTheDocument();
  });

  it("shows positive delta in success styling", () => {
    render(<Stat label="Subscribers" value="100" delta={4.8} />);
    expect(screen.getByText("+4.8%")).toHaveClass("text-success");
  });

  it("shows skeleton while loading", () => {
    const { container } = render(<Stat label="Posts" value="—" isLoading />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });
});
