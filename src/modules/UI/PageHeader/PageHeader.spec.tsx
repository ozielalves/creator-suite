import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders title and description", () => {
    render(<PageHeader title="Dashboard" description="Overview of your studio" />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Overview of your studio")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(
      <PageHeader title="Analytics" actions={<button type="button">Export</button>} />,
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });
});
