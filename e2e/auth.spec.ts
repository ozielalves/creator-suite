import { expect, test } from "@playwright/test";
import { clearAuthStorage, DEMO_EMAIL, login } from "./helpers/auth";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page);
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await page.getByLabel("Email").fill(DEMO_EMAIL);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("signs in with the demo account", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Alex Morgan")).toBeVisible();
    await expect(page.getByRole("button", { name: "New post" })).toBeVisible();
  });

  test("signs out and returns to login", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});
