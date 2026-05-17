import { create } from "zustand";
import type { AuthUser } from "../types";
import { AuthService } from "../services/AuthService";

/**
 * Zustand chosen over Redux for:
 *  - minimal boilerplate (no actions/reducers ceremony)
 *  - predictable selector subscriptions → fewer re-renders
 *  - tiny mental model → faster team onboarding
 *  - scales naturally via slices when domains grow
 */
type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  setUser: (user: AuthUser | null) => void;
  hydrate: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) =>
    set({ user, status: user ? "authenticated" : "unauthenticated" }),
  hydrate: async () => {
    AuthService.hydrate();
    if (!AuthService.isAuthenticated()) {
      set({ status: "unauthenticated", user: null });
      return;
    }
    set({ status: "loading" });
    try {
      const user = await AuthService.me();
      set({ user, status: "authenticated" });
    } catch {
      AuthService.logout();
      set({ status: "unauthenticated", user: null });
    }
  },
  logout: () => {
    AuthService.logout();
    set({ user: null, status: "unauthenticated" });
  },
}));
