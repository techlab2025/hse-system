/** With Vite running: node scripts/sidebar-drag-scroll-regression.mjs [http://127.0.0.1:5180] */
import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
const origin = process.argv[2] || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ channel: 'chromium', headless: true })
try {
  for (const nested of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${origin}/scripts/fixtures/sidebar-drag-scroll.html${nested ? '?nested' : ''}`)
    await page.locator('li[data-field="operations"] > details > summary').click()
    const source = page.locator('[data-drag-item="operations/Projects"]')
    await source.hover()
    const box = await source.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 16, box.y + box.height / 2 + 8, { steps: 5 })
    await expect(page.getByRole('button', { name: 'Cancel move', exact: true })).toBeEnabled()
    const bounds = nested
      ? await page.locator('#scroll-container').boundingBox()
      : { y: 0, height: 700 }
    const scrollTop = () =>
      page.evaluate(
        (nested) =>
          nested ? document.querySelector('#scroll-container').scrollTop : window.scrollY,
        nested,
      )
    const before = await scrollTop()
    await page.mouse.move(500, Math.min(690, bounds.y + bounds.height - 8), { steps: 5 })
    await page.mouse.move(500, Math.min(690, bounds.y + bounds.height - 8))
    await expect.poll(scrollTop).toBeGreaterThan(before + 100)
    // The pointer can stay at the edge: scrolling continues between dragover events.
    const continuing = await scrollTop()
    await expect.poll(scrollTop).toBeGreaterThan(continuing + 100)
    const atBottom = await scrollTop()
    await page.mouse.move(500, Math.max(8, bounds.y + 8), { steps: 5 })
    await page.mouse.move(500, Math.max(8, bounds.y + 8))
    await expect.poll(scrollTop).toBeLessThan(atBottom - 80)
    // Wheel scrolling must not be immediately reversed by the active edge scroll.
    const beforeWheel = await scrollTop()
    await page.mouse.wheel(0, 350)
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 250)))
    assert.ok(
      (await scrollTop()) > beforeWheel + 150,
      'wheel down should win over the top-edge auto scroll',
    )
    await page.mouse.move(500, bounds.y + bounds.height / 2, { steps: 5 })
    await page.mouse.move(500, bounds.y + bounds.height / 2)
    const wheelDownPosition = await scrollTop()
    await page.mouse.wheel(0, -180)
    await expect.poll(scrollTop).toBeLessThan(wheelDownPosition - 100)
    await page.mouse.up()
    await expect(page.getByRole('button', { name: 'Cancel move', exact: true })).toBeDisabled()
    // Once the drag ends, an edge dragover from another source must not restart scrolling.
    const stopped = await scrollTop()
    await page.evaluate(() =>
      document.dispatchEvent(new DragEvent('dragover', { clientY: 695, bubbles: true })),
    )
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 200)))
    assert.equal(await scrollTop(), stopped)
    assert.deepEqual(errors, [])
    await page.close()
  }
  console.log(
    'PASS: dragging supports up/down wheel scrolling, continuous edge scrolling in page/nested containers, and cleanup after dropping.',
  )
} finally {
  await browser.close()
}
