import { expect, test, type Page } from '@playwright/test'
import { writeFileSync } from 'node:fs'

const appUrl = process.env.MOBILE_AUDIT_URL ?? 'http://localhost:5173'
const email = process.env.MOBILE_AUDIT_EMAIL
const password = process.env.MOBILE_AUDIT_PASSWORD

type Overflow = {
  route: string
  tag: string
  classes: string
  width: number
  left: number
  right: number
  text: string
}

async function findOverflow(page: Page, route: string): Promise<Overflow[]> {
  return page.evaluate((currentRoute) => {
    const viewportWidth = document.documentElement.clientWidth
    return [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => {
        const style = getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed' || style.opacity === '0') return false
        if (element.closest('[aria-hidden="true"]')) return false
        if (element.closest('.sidebar-wrapper')) return false
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && (rect.right > viewportWidth + 2 || rect.left < -8)
      })
      .filter((element) => !element.closest('.p-datatable-wrapper, .table-responsive, .table-container, [class*="table-wrapper"], .p-tablist, .p-breadcrumb'))
      .slice(0, 100)
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          route: currentRoute,
          tag: element.tagName.toLowerCase(),
          classes: typeof element.className === 'string' ? element.className.slice(0, 180) : '',
          width: Math.round(rect.width),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          text: (element.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
        }
      })
  }, route)
}

test('audit authenticated organization pages at 400px', async ({ page }) => {
  expect(email, 'Set MOBILE_AUDIT_EMAIL').toBeTruthy()
  expect(password, 'Set MOBILE_AUDIT_PASSWORD').toBeTruthy()
  await page.setViewportSize({ width: 400, height: 900 })
  await page.addInitScript(() => localStorage.setItem('lang', 'ar'))
  await page.goto(`${appUrl}/login/organization`)
  await page.locator('#email').fill(email!)
  await page.locator('#password').fill(password!)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((url) => url.pathname === '/organization', { timeout: 30_000 })
  await page.waitForTimeout(1_000)

  const routes = new Set<string>(['/organization'])
  const collectRoutes = async () => {
    const found = await page.locator('a[href^="/organization"]').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).pathname),
    )
    found.forEach((route) => routes.add(route))
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.reload()
  await page.waitForTimeout(500)
  await collectRoutes()
  const groupButtons = page.locator('.side-rail-btn')
  for (let index = 0; index < (await groupButtons.count()); index += 1) {
    await groupButtons.nth(index).evaluate((button: HTMLButtonElement) => button.click())
    await page.waitForTimeout(100)
    await collectRoutes()
  }

  const findings: Overflow[] = []
  await page.setViewportSize({ width: 400, height: 900 })
  for (const route of routes) {
    await page.goto(`${appUrl}${route}`)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(500)
    findings.push(...(await findOverflow(page, route)))
  }
  writeFileSync('mobile-responsive-audit-results.json', `${JSON.stringify({ routes: [...routes], findings }, null, 2)}\n`)
  console.log(`MOBILE_ROUTES=${routes.size} MOBILE_OVERFLOWS=${findings.length}`)
})
