import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate } from "./AuthGate";
import { useAuthStore } from "../hooks/useAuthStore";

const mockNavigate = vi.fn();
let pathname = "/dashboard";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>
    select({ location: { pathname } }),
}));

describe("AuthGate", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    pathname = "/dashboard";
    useAuthStore.setState({
      user: null,
      status: "idle",
      hydrate: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
    });
  });

  it("renders children", () => {
    render(
      <AuthGate>
        <p>Protected content</p>
      </AuthGate>,
    );
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("hydrates auth when status is idle", () => {
    const hydrate = vi.fn();
    useAuthStore.setState({ status: "idle", hydrate });

    render(<AuthGate>child</AuthGate>);
    expect(hydrate).toHaveBeenCalled();
  });

  it("redirects unauthenticated users away from protected routes", () => {
    useAuthStore.setState({ status: "unauthenticated" });

    render(<AuthGate>child</AuthGate>);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });

  it("allows public auth routes without redirecting", () => {
    pathname = "/login";
    useAuthStore.setState({ status: "unauthenticated" });

    render(<AuthGate>child</AuthGate>);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
