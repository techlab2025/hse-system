import fs from 'node:fs'
import nodePath from 'node:path'
import os from 'node:os'
import { chromium } from '@playwright/test'
import { installFixtures } from '../../src/features/Organization/Project/tests/project-fixtures.mjs'

// Read-only navigation against local API fixtures; never use production credentials.
const base = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(base))
  throw new Error('Route smoke checks require a local server and fixture API responses.')
const output = process.argv[2] || nodePath.join(os.tmpdir(), 'hse-localization-route-audit.json')
const browser = await chromium.launch({ channel: 'chromium', headless: true })
const report = {
  fixtureData: true,
  generatedAt: new Date().toISOString(),
  registry: [],
  results: [],
  limitations: [
    'Navigation smoke coverage; does not exercise every dialog, mutation, permission combination, or real backend response.',
    'Required route parameters use fixture record ID 1 and may not represent every feature contract.',
    'Wrong-language text is collected for human review because records, technical codes, and proper names must be preserved.',
  ],
}
try {
  for (const role of ['organization', 'admin']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage()
    await installFixtures(page)
    await page.addInitScript(() => {
      if (window.name.startsWith('audit-locale:'))
        localStorage.setItem('lang', window.name.slice(13))
    })
    if (role === 'admin')
      await page.addInitScript(() => {
        const state = JSON.parse(localStorage.getItem('user'))
        state.user.type = 1
        localStorage.setItem('user', JSON.stringify(state))
      })
    await page.goto(base + (role === 'admin' ? '/admin/equipments' : '/organization/documentation'))
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
    const registry = await page.evaluate(() =>
      document
        .querySelector('#app')
        .__vue_app__.config.globalProperties.$router.getRoutes()
        .map((r) => ({
          path: r.path,
          name: String(r.name || ''),
          breadcrumb: r.meta.breadcrumb || '',
          redirect: !!r.redirect,
        })),
    )
    if (!report.registry.length) report.registry = registry
    const routes = registry.filter(
      (r) => r.path.startsWith(`/${role}/`) && !r.redirect && !r.path.includes(':pathMatch'),
    )
    let current
    page.on('console', (message) => {
      if (current && /Not found .* key/.test(message.text()))
        current.missingKeys.push(message.text())
      if (current && message.type() === 'error') current.consoleErrors.push(message.text())
    })
    page.on('pageerror', (e) => {
      if (current) current.errors.push(e.message)
    })
    for (const locale of ['en', 'ar']) {
      await page.evaluate((locale) => {
        window.name = 'audit-locale:' + locale
      }, locale)
      // The actual language control updates the singleton, html, PrimeVue and localStorage.
      await page
        .getByRole('button', {
          name:
            locale === 'en'
              ? /switch to english|التبديل إلى الإنجليزية/i
              : /switch to arabic|التبديل إلى العربية/i,
        })
        .evaluateAll((buttons) => buttons[0]?.click())
      for (const route of routes) {
        const path = route.path.replace(/\/:\w+\?/g, '').replace(/:\w+/g, '1')
        current = {
          role,
          locale,
          pattern: route.path,
          path,
          errors: [],
          missingKeys: [],
          consoleErrors: [],
        }
        const result = await Promise.race([
          page
            .evaluate(async (path) => {
              const router =
                document.querySelector('#app').__vue_app__.config.globalProperties.$router
              await router.push(path)
              return { resolved: router.currentRoute.value.fullPath }
            }, path)
            .catch((e) => ({ navigationError: e.message })),
          new Promise((resolve) =>
            setTimeout(() => resolve({ navigationError: 'Navigation timeout' }), 8000),
          ),
        ])
        Object.assign(current, result)
        await page.waitForTimeout(160)
        Object.assign(
          current,
          await page
            .evaluate(() => {
              const root =
                document.querySelector('.main-content') ||
                document.querySelector('main') ||
                document.querySelector('#app')
              const text = root?.innerText || ''
              const snippets = text
                .split(/\n+/)
                .map((s) => s.trim())
                .filter(Boolean)
              const isAr = document.documentElement.lang === 'ar'
              return {
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                heading: root?.querySelector('h1,h2,h3,h4,h5')?.textContent?.trim() || '',
                contentElements: root?.children.length || 0,
                overflow: document.documentElement.scrollWidth > innerWidth + 2,
                oppositeScriptCandidates: [
                  ...new Set(
                    snippets.filter((s) =>
                      isAr ? /[a-zA-Z]{3}/.test(s) : /[\u0600-\u06ff]/.test(s),
                    ),
                  ),
                ].slice(0, 25),
              }
            })
            .catch((e) => ({ navigationError: e.message })),
        )
        current.errors = [...new Set(current.errors)]
        current.consoleErrors = [...new Set(current.consoleErrors)]
        current.renderErrors = current.consoleErrors.filter((message) =>
          /ReferenceError|TypeError|SyntaxError|before initialization|is not defined/.test(message),
        )
        current.missingKeys = [...new Set(current.missingKeys)]
        report.results.push(current)
        if (current.errors.length || current.navigationError) {
          current = undefined
          await page.goto(
            base + (role === 'admin' ? '/admin/equipments' : '/organization/documentation'),
          )
          await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__)
        }
        if (report.results.length % 25 === 0) {
          fs.mkdirSync(nodePath.dirname(output), { recursive: true })
          fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
          console.log(
            `${report.results.length} route/locale checks; ${report.results.filter((r) => r.errors.length || r.navigationError).length} with runtime/navigation errors`,
          )
        }
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
}
console.log(
  JSON.stringify({
    registry: report.registry.length,
    checks: report.results.length,
    errors: report.results.filter((r) => r.errors.length || r.navigationError).length,
  }),
)
