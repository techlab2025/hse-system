import { expect, test, type Page } from '@playwright/test'
import { writeFileSync } from 'node:fs'

const appUrl = process.env.I18N_AUDIT_URL ?? 'http://localhost:5173'
const email = process.env.I18N_AUDIT_EMAIL
const password = process.env.I18N_AUDIT_PASSWORD

type Finding = { route: string; source: string; text: string }

async function collectEnglish(page: Page, route: string): Promise<Finding[]> {
  return page.evaluate((currentRoute) => {
    const findings: Finding[] = []
    const ignoredTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG'])
    const hasEnglish = (value: string) => /[A-Za-z]{2,}/.test(value)
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

    document.querySelectorAll('body *').forEach((element) => {
      if (ignoredTags.has(element.tagName) || element.closest('[aria-hidden="true"]')) return

      Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .forEach((node) => {
          const text = normalize(node.textContent ?? '')
          if (text && hasEnglish(text)) findings.push({ route: currentRoute, source: 'text', text })
        })

      ;['alt', 'aria-label', 'label', 'placeholder', 'title'].forEach((attribute) => {
        const text = normalize(element.getAttribute(attribute) ?? '')
        if (text && hasEnglish(text)) {
          findings.push({ route: currentRoute, source: attribute, text })
        }
      })
    })

    return findings
  }, route)
}

test('audit authenticated Arabic organization UI', async ({ page }) => {
  expect(email, 'Set I18N_AUDIT_EMAIL').toBeTruthy()
  expect(password, 'Set I18N_AUDIT_PASSWORD').toBeTruthy()

  await page.addInitScript(() => localStorage.setItem('lang', 'ar'))
  await page.goto(`${appUrl}/login/organization`)
  await page.locator('#email').fill(email!)
  await page.locator('#password').fill(password!)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((url) => url.pathname === '/organization', { timeout: 30_000 })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(1_000)
  await page.screenshot({ path: 'i18n-arabic-organization.png', fullPage: true })

  const routes: string[] = await page.locator('a[href^="/organization"]').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).pathname),
  )
  const groupButtons = page.locator('.side-rail-btn')
  for (let index = 0; index < (await groupButtons.count()); index += 1) {
    await groupButtons.nth(index).click()
    await page.waitForTimeout(100)
    routes.push(
      ...(await page.locator('a[href^="/organization"]').evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).pathname),
      )),
    )
  }
  routes.unshift('/organization')

  const findings: Finding[] = []
  for (const route of [...new Set(routes)]) {
    await page.goto(`${appUrl}${route}`)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(800)
    findings.push(...(await collectEnglish(page, route)))
  }

  const unique = [...new Map(findings.map((item) => [`${item.route}|${item.source}|${item.text}`, item])).values()]
  writeFileSync('i18n-ui-audit-results.json', `${JSON.stringify(unique, null, 2)}\n`)
  console.log(`I18N_AUDIT_RESULTS=${JSON.stringify(unique)}`)
})
