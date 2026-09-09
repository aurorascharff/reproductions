import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

test.describe.serial("navigation-stage instant contract", () => {
  test("[setup] warms the server cache without warming the reproduction browser", async ({
    page,
  }) => {
    await page.goto("/sessions/aurora-keynote");
    await expect(page.getByTestId("related-sessions")).toBeVisible();
  });

  test("[reproduction] navigation-only related sessions stay out of the prefetched UI", async ({
    page,
  }) => {
    await page.goto("/sessions");

    await instant(page, async () => {
      await page.getByTestId("featured-session").click();
      await page.waitForURL(
        (url) => url.pathname === "/sessions/aurora-keynote",
      );

      await test.step("control: the selected-link prefetch includes the cached summary", async () => {
        await expect(page.getByTestId("session-summary")).toBeVisible();
      });

      await test.step("FAILS: the navigation-only region is absent and its fallback is visible", async () => {
        await expect(
          page.getByTestId("related-sessions"),
          "Expected related sessions below unstable_navigation() to be absent during the instant() lock, but they were already rendered in the prefetched UI.",
        ).toHaveCount(0);
        await expect(page.getByTestId("related-fallback")).toBeVisible();
      });

      await test.step("control: request-time content is absent and its fallback is visible", async () => {
        await expect(page.getByTestId("live-questions")).toHaveCount(0);
        await expect(page.getByTestId("live-fallback")).toBeVisible();
      });
    });

    await test.step("after the lock: deferred regions finish rendering", async () => {
      await expect(page.getByTestId("related-sessions")).toBeVisible();
      await expect(page.getByTestId("live-questions")).toBeVisible();
    });
  });
});
