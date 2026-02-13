import { test, expect } from '@playwright/test'

test('capture game screenshot after 25 seconds', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.click('text=Start Game')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 15000 })

  // Wait 25 seconds so zombies start appearing
  await page.waitForTimeout(25000)

  await page.screenshot({ path: 'tests/e2e/screenshots/game-25s.png' })
})

test('capture game initial state', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.click('text=Start Game')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await page.waitForTimeout(2000)

  await page.screenshot({ path: 'tests/e2e/screenshots/game-initial.png' })
})
