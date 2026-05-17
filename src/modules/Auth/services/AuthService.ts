import { HttpClient } from "../../Common/services/HttpClient";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants";
import {
  parseForgotPasswordEmail,
  parseLoginCredentials,
  parseRegisterCredentials,
} from "../validation";
import type { AuthResponse, AuthUser, LoginCredentials, RegisterCredentials } from "../types";

function assertValid<T>(result: { success: boolean; data?: T; error?: unknown }): T {
  if (!result.success) {
    throw result.error;
  }
  return result.data as T;
}

/**
 * AuthService — singleton orchestrating credential exchange and token storage.
 * Components never call HttpClient directly for auth: they go through here.
 */
class AuthServiceImpl {
  private token: string | null = null;

  hydrate() {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (t) {
      this.token = t;
      HttpClient.setAuthToken(t);
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const parsed = assertValid<LoginCredentials>(parseLoginCredentials(credentials));
    const res = await HttpClient.post<AuthResponse>("/auth/login", parsed);
    this.persist(res);
    return res.user;
  }

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const parsed = assertValid<RegisterCredentials>(parseRegisterCredentials(credentials));
    const res = await HttpClient.post<AuthResponse>("/auth/register", parsed);
    this.persist(res);
    return res.user;
  }

  async forgotPassword(email: string): Promise<void> {
    const parsed = assertValid<{ email: string }>(parseForgotPasswordEmail(email));
    await HttpClient.post("/auth/forgot-password", parsed);
  }

  async me(): Promise<AuthUser> {
    return HttpClient.get<AuthUser>("/auth/me");
  }

  logout() {
    this.token = null;
    HttpClient.setAuthToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  }

  private persist(res: AuthResponse) {
    this.token = res.token;
    HttpClient.setAuthToken(res.token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.token);
    }
  }
}

const authService = new AuthServiceImpl();
export { authService as AuthService };
