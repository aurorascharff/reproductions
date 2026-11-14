import { test, expect } from '@playwright/test'
import { instant } from '@next/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/shop/uk?category=all')
  await expect(page.locator('[data-testid=stock]:visible')).toHaveText('all: 10 in stock')
})

test('ordinary category navigation works', async ({ page }) => {
  await page.getByRole('link', { name: 'Home', exact: true }).click()
  await expect(page.locator('[data-testid=category]:visible')).toHaveText('uk: home')
  await expect(page.locator('[data-testid=stock]:visible')).toHaveText('home: 10 in stock')
})

test('category navigation commits inside instant()', async ({ page }) => {
  await instant(page, async () => {
    await page.getByRole('link', { name: 'Home', exact: true }).click()
    await page.waitForURL('**/shop/uk?category=home')
    await expect(page.locator('[data-testid=category]:visible')).toHaveText('uk: home')
    await expect(page.locator('[data-testid=pending]:visible')).toBeVisible()
    await expect(page.locator('[data-testid=stock]:visible')).toBeHidden()
  })
  await expect(page.locator('[data-testid=stock]:visible')).toHaveText('home: 10 in stock')
})

test('region navigation commits inside instant()', async ({ page }) => {
  await instant(page, async () => {
    await page.getByRole('link', { name: 'Norway', exact: true }).click()
    await page.waitForURL('**/shop/no?category=all')
    await expect(page.locator('[data-testid=category]:visible')).toHaveText('no: all')
    await expect(page.locator('[data-testid=pending]:visible')).toBeVisible()
    await expect(page.locator('[data-testid=stock]:visible')).toBeHidden()
  })
})
