import { describe, it, expect, vi, beforeEach } from "vitest";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants";

const httpMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  setAuthToken: vi.fn(),
}));

vi.mock("@/modules/Common/services/HttpClient", () => ({
  HttpClient: httpMock,
}));

import { AuthService } from "./AuthService";

const user = {
  id: "u_1",
  email: "alex@creator.studio",
  name: "Alex",
  avatarUrl: null,
  plan: "pro" as const,
};

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    AuthService.logout();
  });

  it("hydrates token from localStorage", () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "stored-token");
    AuthService.hydrate();
    expect(AuthService.isAuthenticated()).toBe(true);
    expect(AuthService.getToken()).toBe("stored-token");
    expect(httpMock.setAuthToken).toHaveBeenCalledWith("stored-token");
  });

  it("login persists token and returns user", async () => {
    httpMock.post.mockResolvedValue({ token: "jwt", user });

    const result = await AuthService.login({
      email: "alex@creator.studio",
      password: "secret",
    });

    expect(result).toEqual(user);
    expect(httpMock.post).toHaveBeenCalledWith("/auth/login", {
      email: "alex@creator.studio",
      password: "secret",
    });
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe("jwt");
    expect(AuthService.isAuthenticated()).toBe(true);
  });

  it("register persists token and returns user", async () => {
    httpMock.post.mockResolvedValue({ token: "jwt", user });

    await AuthService.register({
      email: "new@creator.studio",
      password: "secret",
      name: "New User",
    });

    expect(httpMock.post).toHaveBeenCalledWith("/auth/register", {
      email: "new@creator.studio",
      password: "secret",
      name: "New User",
    });
  });

  it("forgotPassword posts email", async () => {
    httpMock.post.mockResolvedValue(undefined);
    await AuthService.forgotPassword("alex@creator.studio");
    expect(httpMock.post).toHaveBeenCalledWith("/auth/forgot-password", {
      email: "alex@creator.studio",
    });
  });

  it("me fetches current user", async () => {
    httpMock.get.mockResolvedValue(user);
    await expect(AuthService.me()).resolves.toEqual(user);
    expect(httpMock.get).toHaveBeenCalledWith("/auth/me");
  });

  it("logout clears token and storage", () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "jwt");
    AuthService.hydrate();
    AuthService.logout();
    expect(AuthService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(httpMock.setAuthToken).toHaveBeenLastCalledWith(null);
  });
});
