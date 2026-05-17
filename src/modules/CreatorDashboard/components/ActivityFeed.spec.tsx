import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "./ActivityFeed";

vi.mock("../hooks/useDashboard", () => ({
  useRecentActivity: () => ({
    data: [
      {
        id: "a_1",
        actor: "Maya Chen",
        action: "subscribed to your Pro tier",
        at: new Date().toISOString(),
      },
    ],
    isLoading: false,
  }),
}));

describe("ActivityFeed", () => {
  it("renders activity items", () => {
    render(<ActivityFeed />);
    expect(screen.getByText("Recent activity")).toBeInTheDocument();
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText("subscribed to your Pro tier")).toBeInTheDocument();
  });
});
