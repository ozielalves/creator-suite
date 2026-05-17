import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCards } from "./StatsCards";

vi.mock("../hooks/useDashboard", () => ({
  useDashboardStats: () => ({
    data: {
      revenueCents: 1284200,
      revenueDelta: 12.4,
      subscribers: 3482,
      subscribersDelta: 4.8,
      posts: 47,
      postsDelta: 8.1,
      engagement: 68.2,
      engagementDelta: -1.2,
    },
    isLoading: false,
  }),
}));

describe("StatsCards", () => {
  it("renders formatted dashboard metrics", () => {
    render(<StatsCards />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12,842")).toBeInTheDocument();
    expect(screen.getByText("Subscribers")).toBeInTheDocument();
    expect(screen.getByText("3,482")).toBeInTheDocument();
    expect(screen.getByText("68.2%")).toBeInTheDocument();
    expect(screen.getByText("-1.2%")).toBeInTheDocument();
  });
});
