import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No messages"
        description="Start a conversation to see messages here."
      />,
    );
    expect(screen.getByRole("heading", { name: "No messages" })).toBeInTheDocument();
    expect(
      screen.getByText("Start a conversation to see messages here."),
    ).toBeInTheDocument();
  });

  it("renders optional action", () => {
    render(
      <EmptyState title="Empty" action={<button type="button">Create</button>} />,
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
