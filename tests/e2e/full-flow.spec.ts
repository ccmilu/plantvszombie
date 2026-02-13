import { test, expect, type Page } from '@playwright/test'

test('full game flow: place plants, collect sun, fight zombies', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[CONSOLE ERROR]', msg.text())
  })

  await page.goto('http://localhost:5173/')
  await page.click('text=Start Game')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await page.waitForTimeout(1000)

  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return

  // Helper: design coords to page coords
  const design2page = (dx: number, dy: number) => ({
    x: box.x + dx * (box.width / 900),
    y: box.y + dy * (box.height / 600),
  })

  // Step 1: Place sunflower at row 1, col 1
  // gridToWorld(1, 1) = (40 + 1*82 + 41, 85 + 1*100 + 50) = (163, 235)
  const sunflowerCard = page.locator('[style*="Card.png"]').first()
  await sunflowerCard.click()
  await page.waitForTimeout(200)

  const cell11 = design2page(163, 235)
  await page.mouse.click(cell11.x, cell11.y)
  await page.waitForTimeout(500)

  // Take screenshot to verify sunflower placed
  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step1-sunflower.png' })

  // Step 2: Wait for sky sun to appear (10s) and try to collect it
  await page.waitForTimeout(12000)
  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step2-wait-sun.png' })

  // Click around the center area to try collecting suns
  for (let i = 0; i < 5; i++) {
    const rx = 100 + Math.random() * 700
    const ry = 100 + Math.random() * 400
    const p = design2page(rx, ry)
    await page.mouse.click(p.x, p.y)
    await page.waitForTimeout(200)
  }

  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step3-after-collect.png' })

  // Step 3: Wait for sunflower to produce sun (24s interval from placement)
  // and more sky suns. Wait until we have enough for peashooter (100)
  await page.waitForTimeout(15000)

  // Click around to collect any visible suns
  for (let i = 0; i < 10; i++) {
    const rx = 100 + Math.random() * 700
    const ry = 100 + Math.random() * 400
    const p = design2page(rx, ry)
    await page.mouse.click(p.x, p.y)
    await page.waitForTimeout(300)
  }

  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step4-more-sun.png' })

  // Step 4: Try to place a peashooter
  const secondCard = page.locator('[style*="Card.png"]').nth(1)
  if (await secondCard.isVisible()) {
    await secondCard.click()
    await page.waitForTimeout(200)

    // Place at row 2, col 4 (center of field)
    const cell24 = design2page(40 + 4 * 82 + 41, 85 + 2 * 100 + 50)
    await page.mouse.click(cell24.x, cell24.y)
    await page.waitForTimeout(500)
  }

  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step5-peashooter.png' })

  // Step 5: Wait and observe combat (zombies should be fighting by now)
  await page.waitForTimeout(10000)
  await page.screenshot({ path: 'tests/e2e/screenshots/flow-step6-combat.png' })

  // Final: Verify no critical errors
  const criticalErrors = errors.filter(e =>
    !e.includes('Failed to load asset') && !e.includes('favicon')
  )
  expect(criticalErrors).toEqual([])
})
