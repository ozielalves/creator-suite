import { describe, it, expect, beforeEach } from "vitest";
import { applyTheme, useThemeStore } from "./useThemeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "light" });
  });

  it("applies dark class to document element", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles theme via store", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
