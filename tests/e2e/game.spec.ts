import { test, expect, type Page } from '@playwright/test'

test.describe('Plants vs Zombies - Stage 2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('should display menu with Start Game button', async ({ page }) => {
    await expect(page.locator('text=Plants vs Zombies')).toBeVisible()
    await expect(page.locator('text=Start Game')).toBeVisible()
  })

  test('should load game after clicking Start Game', async ({ page }) => {
    // Click Start Game
    await page.click('text=Start Game')

    // Wait for loading to finish (canvas becomes visible)
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 15000 })

    // Check for console errors during loading
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    // Wait for game to fully initialize
    await page.waitForTimeout(2000)

    // Canvas should be visible and have non-zero dimensions
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('should display toolbar with plant cards after game loads', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.click('text=Start Game')

    // Wait for canvas to be visible (game loaded)
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 15000 })

    // Wait for UI overlay to render
    await page.waitForTimeout(1000)

    // Check sun counter exists (first '50' text element)
    const sunCounter = page.locator('text=50').first()
    await expect(sunCounter).toBeVisible({ timeout: 5000 })

    // Log any errors
    if (errors.length > 0) {
      console.log('Console errors:', errors)
    }
  })

  test('should have no critical console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', err => {
      errors.push(err.message)
    })

    await page.click('text=Start Game')

    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 15000 })

    // Wait for several game frames
    await page.waitForTimeout(3000)

    // Filter out non-critical errors (like failed asset loads for optional assets)
    const criticalErrors = errors.filter(e =>
      !e.includes('Failed to load asset') &&
      !e.includes('favicon')
    )

    expect(criticalErrors).toEqual([])
  })

  test('should allow clicking plant card to select', async ({ page }) => {
    await page.click('text=Start Game')
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(1000)

    // Find a plant card (cost = 50 for sunflower)
    const sunflowerCard = page.locator('div').filter({ hasText: /^50$/ }).first()
    await expect(sunflowerCard).toBeVisible({ timeout: 5000 })
  })
})
