import { test, expect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

for (const width of [1440, 1024, 768, 390]) {
  for (const locale of ['en', 'ar']) {
    test(`shared footer at ${width}px, ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await installFixtures(page, { locale })
      await page.goto(`${baseURL}/organization/system-identity`)
      const footer = page.locator('footer.footer')
      const container = page.locator('.sidebar-container')
      await expect(footer).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')

      const checkGeometry = async (drawerOpen = false) => {
        // Wait for sidebar width transitions to settle before measuring the shell.
        await page.waitForTimeout(350)
        const box = await footer.evaluate((element) => {
          const rect = (node) => {
            const { left, right, top, bottom, width } = node.getBoundingClientRect()
            return { left, right, top, bottom, width }
          }
          return {
            footer: rect(element),
            wrapper: rect(document.querySelector('.content-wrapper')),
            content: rect(document.querySelector('.main-content')),
            sidebar: rect(document.querySelector('.sidebar')),
            position: getComputedStyle(element).position,
            scrollWidth: document.documentElement.scrollWidth,
            viewport: innerWidth,
          }
        })
        expect(box.position).toBe('static')
        expect(Math.abs(box.footer.left - box.wrapper.left)).toBeLessThan(1)
        expect(Math.abs(box.footer.right - box.wrapper.right)).toBeLessThan(1)
        expect(box.footer.top).toBeGreaterThanOrEqual(box.content.bottom - 1)
        expect(box.scrollWidth).toBeLessThanOrEqual(box.viewport)
        if (width > 768) {
          expect(box.sidebar.bottom).toBeLessThanOrEqual(box.footer.top + 1)
          expect(
            box.footer.right <= box.sidebar.left + 1 || box.footer.left >= box.sidebar.right - 1,
          ).toBe(true)
        } else {
          expect(box.footer.width).toBe(width)
          // A mobile drawer overlays the page; its backdrop must cover the footer too.
          if (drawerOpen) {
            await footer.scrollIntoViewIfNeeded()
            expect(
              await footer.evaluate((element) => {
                const r = element.getBoundingClientRect()
                const x = document.documentElement.dir === 'rtl' ? 5 : innerWidth - 5
                return document
                  .elementFromPoint(x, r.top + r.height / 2)
                  ?.classList.contains('sidebar-backdrop')
              }),
            ).toBe(true)
          }
        }
      }

      for (const expanded of [false, true, false]) {
        // Use the public composable to exercise live mode changes without depending on translated labels.
        await page.evaluate(async (expanded) => {
          const { useSystemIdentity } = await import('/src/composables/useSystemIdentity.ts')
          useSystemIdentity().identity.value.appearance.sidebarMode = expanded
            ? 'expanded'
            : 'compact'
        }, expanded)
        await checkGeometry()
        if (width > 768) {
          await expect(page.locator('.sidebar')).toHaveCSS('width', expanded ? '300px' : '90px')
        }
        if (width <= 768) {
          await page.getByRole('button', { name: /open menu|فتح القائمة/i }).click()
          await expect(container).toHaveClass(/sidebar-open/)
          await checkGeometry(true)
          await page
            .locator('.sidebar-backdrop')
            .click({ position: { x: locale === 'ar' ? 5 : width - 5, y: 400 } })
          await expect(container).not.toHaveClass(/sidebar-open/)
          await checkGeometry()
        }
      }

      // Keep the real shell while controlling content length independently of API data.
      await page.addStyleTag({ content: '.main-content > * { display: none !important; }' })
      await checkGeometry()
      expect(
        await footer.evaluate((element) =>
          Math.abs(element.getBoundingClientRect().bottom - innerHeight),
        ),
      ).toBeLessThan(1)
      await page.addStyleTag({
        content: '.main-content::after { content: ""; display: block; height: 1800px; }',
      })
      await checkGeometry()
      expect(
        await footer.evaluate((element) => element.getBoundingClientRect().top),
      ).toBeGreaterThan(900)

      // Check a second shared-layout route with real table/pagination content.
      await page.goto(`${baseURL}/organization/projects`)
      await expect(page.locator('.pagination-item').first()).toBeVisible()
      await checkGeometry()
      expect(
        await page
          .locator('.pagination-item')
          .last()
          .evaluate(
            (item) =>
              item.getBoundingClientRect().bottom <=
              document.querySelector('footer.footer').getBoundingClientRect().top,
          ),
      ).toBe(true)
      await page.goto(`${baseURL}/organization/project-details/433/risk-assessments`)
      await expect(page.locator('.main-content table').first()).toBeVisible()
      await checkGeometry()
      expect(
        await page
          .locator('.main-content table')
          .first()
          .evaluate(
            (table) =>
              table.getBoundingClientRect().bottom <=
              document.querySelector('footer.footer').getBoundingClientRect().top,
          ),
      ).toBe(true)
    })
  }
}

for (const locale of ['en', 'ar']) {
  test(`desktop sidebar and flyout stop above footer, ${locale}`, async ({ page }) => {
    await installFixtures(page, { locale })
    await page.goto(`${baseURL}/organization/system-identity`)
    await expect(page.locator('footer.footer')).toBeVisible()
    for (const width of [1440, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      for (const expanded of [false, true]) {
        await page.evaluate(async (expanded) => {
          const { useSystemIdentity } = await import('/src/composables/useSystemIdentity.ts')
          useSystemIdentity().identity.value.appearance.sidebarMode = expanded
            ? 'expanded'
            : 'compact'
        }, expanded)
        await page.locator('footer.footer').scrollIntoViewIfNeeded()
        if (!expanded) {
          await page.locator('.side-rail-nav button').nth(1).hover()
          await expect(page.locator('.side-pane')).toBeVisible()
          // Hovering can scroll the rail into view; measure again at the page bottom.
          await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
        }
        await expect
          .poll(() =>
            page.evaluate(() => {
              const footer = document.querySelector('footer.footer').getBoundingClientRect()
              return [...document.querySelectorAll('.sidebar, .side-pane')].every(
                (element) => element.getBoundingClientRect().bottom <= footer.top + 1,
              )
            }),
          )
          .toBe(true)
        await page.mouse.move(width / 2, 100)
      }
    }
  })
}
