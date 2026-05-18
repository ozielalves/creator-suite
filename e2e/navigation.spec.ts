import { expect, test, type Page } from "@playwright/test";
import { clearAuthStorage, login } from "./helpers/auth";

test.describe("App navigation", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page);
    await login(page);
  });

  const routes = [
    {
      label: "Dashboard",
      path: "/dashboard",
      assert: (page: Page) =>
        expect(page.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible(),
    },
    {
      label: "Messaging",
      path: "/messaging",
      assert: (page: Page) =>
        expect(page.getByRole("heading", { name: "Messages", level: 2 })).toBeVisible(),
    },
    {
      label: "Analytics",
      path: "/analytics",
      assert: (page: Page) =>
        expect(page.getByRole("heading", { name: "Analytics", level: 1 })).toBeVisible(),
    },
    {
      label: "Notifications",
      path: "/notifications",
      assert: (page: Page) =>
        expect(page.getByRole("heading", { name: "Notifications", level: 1 })).toBeVisible(),
    },
    {
      label: "Subscription",
      path: "/subscription",
      assert: (page: Page) =>
        expect(page.getByRole("heading", { name: "Subscription", level: 1 })).toBeVisible(),
    },
  ] as const;

  for (const route of routes) {
    test(`navigates to ${route.label}`, async ({ page }) => {
      await page
        .getByRole("complementary", { name: "Primary" })
        .getByRole("link", { name: route.label })
        .click();
      await expect(page).toHaveURL(new RegExp(`${route.path}$`));
      await route.assert(page);
    });
  }
});
