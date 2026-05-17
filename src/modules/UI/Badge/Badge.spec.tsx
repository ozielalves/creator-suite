import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Pro</Badge>);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("applies tone styles", () => {
    render(<Badge tone="success">Active</Badge>);
    expect(screen.getByText("Active")).toHaveClass("text-success");
  });
});
