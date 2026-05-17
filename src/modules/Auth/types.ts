export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: "free" | "pro" | "studio";
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
