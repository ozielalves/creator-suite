import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevenueChart } from "./RevenueChart";

vi.mock("../hooks/useDashboard", () => ({
  useRevenueSeries: () => ({
    data: [
      { month: "Jun", revenue: 6200 },
      { month: "Jul", revenue: 7180 },
    ],
    isLoading: false,
  }),
}));

vi.mock("recharts", () => ({
  Area: () => null,
  AreaChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  CartesianGrid: () => null,
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="chart">{children}</div>
  ),
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

describe("RevenueChart", () => {
  it("renders chart title and series when loaded", () => {
    render(<RevenueChart />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Last 7 months · gross")).toBeInTheDocument();
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });
});
