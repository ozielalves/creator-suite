export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: "free" | "pro" | "studio";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
