import { expect, type Page } from "@playwright/test";

export const DEMO_EMAIL = process.env.VITE_DEMO_LOGIN_EMAIL || "";
export const DEMO_PASSWORD = process.env.VITE_DEMO_LOGIN_PASSWORD || "";

export async function clearAuthStorage(page: Page) {
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
}

export async function login(page: Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  const email = page.getByLabel("Email");
  const password = page.getByLabel("Password");
  await email.fill(DEMO_EMAIL);
  await password.fill(DEMO_PASSWORD);
  await expect(email).toHaveValue(DEMO_EMAIL);
  await expect(password).toHaveValue(DEMO_PASSWORD);

  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
}
