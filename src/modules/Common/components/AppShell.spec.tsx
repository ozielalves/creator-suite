import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppShell } from "./AppShell";
import { useAuthStore } from "@/modules/Auth";

vi.mock("@tanstack/react-router", () => ({
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>
    select({ location: { pathname: "/dashboard" } }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("AppShell", () => {
  const logout = vi.fn();

  beforeEach(() => {
    logout.mockClear();
    useAuthStore.setState({
      user: {
        id: "u_me",
        email: "alex@creator.studio",
        name: "Alex Morgan",
        avatarUrl: null,
        plan: "pro",
      },
      status: "authenticated",
      hydrate: vi.fn(),
      logout,
      setUser: vi.fn(),
    });
  });

  it("renders navigation and user info", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getAllByText("Alex Morgan").length).toBeGreaterThan(0);
    expect(screen.getByText("alex@creator.studio")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Dashboard" })[0]).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("calls logout when sign out is clicked", () => {
    render(<AppShell>child</AppShell>);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(logout).toHaveBeenCalled();
  });

  it("renders dark mode toggle", () => {
    render(<AppShell>child</AppShell>);
    expect(screen.getAllByRole("switch", { name: "Toggle dark mode" }).length).toBeGreaterThan(0);
  });
});
