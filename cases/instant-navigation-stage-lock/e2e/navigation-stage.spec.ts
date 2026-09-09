import { expect, test } from '@playwright/test'
import { instant } from '@next/playwright'

test.describe.serial('navigation-stage instant contract', () => {
  test('warms the reusable server cache in a separate browser context', async ({
    page,
  }) => {
    await page.goto('/sessions/aurora-keynote')
    await expect(page.getByTestId('related-sessions')).toBeVisible()
  })

  test('navigation-only content stays out of a per-link prefetch', async ({
    page,
  }) => {
    await page.goto('/sessions')

    await instant(page, async () => {
      await page.getByTestId('featured-session').click()
      await page.waitForURL(
        (url) => url.pathname === '/sessions/aurora-keynote'
      )

      // The exact-link prefetch resolves the cached, slug-dependent summary.
      await expect(page.getByTestId('session-summary')).toBeVisible()

      // Documented behavior: unstable_navigation() excludes this cached region
      // from both the App Shell and the per-link prefetch.
      await expect(page.getByTestId('related-sessions')).toHaveCount(0)
      await expect(page.getByTestId('related-fallback')).toBeVisible()

      // Request-time content is also absent while instant() holds dynamic writes.
      await expect(page.getByTestId('live-questions')).toHaveCount(0)
      await expect(page.getByTestId('live-fallback')).toBeVisible()
    })

    await expect(page.getByTestId('related-sessions')).toBeVisible()
    await expect(page.getByTestId('live-questions')).toBeVisible()
  })
})
