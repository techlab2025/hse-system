import { test, expect } from '@playwright/test'
import { useIdentityApiCodeFlag } from './fixtures/system-identity-api-mode.mjs'
import { readFileSync } from 'node:fs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const example = JSON.parse(
  readFileSync(new URL('../docs/examples/system-identity-request.json', import.meta.url), 'utf8'),
)
async function setup(page) {
  await installFixtures(page)
  await page.addInitScript((identity) => {
    if (localStorage.getItem('hse-storage-mode-fixture-seeded')) return
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({ ...identity, name: 'Browser identity' }),
    )
    localStorage.setItem('hse-storage-mode-fixture-seeded', 'true')
  }, example)
  const state = {
    reads: 0,
    writes: [],
    identity: { ...example, name: 'Shared organization identity' },
    delay: null,
  }
  await page.route('**/organization/*system_identity', async (route) => {
    if (route.request().url().endsWith('/fetch_system_identity')) {
      state.reads++
      if (state.delay) await state.delay
    } else {
      state.identity = route.request().postDataJSON()
      state.writes.push(state.identity)
    }
    await route.fulfill({
      json: { status: true, data: { identity: state.identity, updated_at: null } },
    })
  })
  return state
}

test('default local mode loads, saves and resets using the original key without identity requests', async ({
  page,
}) => {
  const state = await setup(page)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-use-api')).toHaveCount(0)
  await expect(page.locator('#identity-name')).toHaveValue('Browser identity')
  await page.locator('#identity-name').fill('Browser-only update')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('System identity has been saved and applied.')
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity')).name),
  ).toBe('Browser-only update')
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('Browser-only update')
  await page.getByRole('button', { name: 'Reset identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Default system identity has been restored.')
  expect(await page.evaluate(() => localStorage.getItem('hse-system-identity'))).toBeNull()
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('HSE.Cloud.Ai')
  expect(state.reads).toBe(0)
  expect(state.writes).toHaveLength(0)
})

test('the true code flag fetches and saves through the API without a UI switch', async ({
  page,
}) => {
  const state = await setup(page)
  await useIdentityApiCodeFlag(page)
  // Obsolete browser preferences cannot override the code flag.
  await page.addInitScript(() => localStorage.setItem('hse-system-identity-use-api', 'false'))
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue('Shared organization identity')
  await expect(page.locator('#identity-use-api')).toHaveCount(0)
  expect(state.reads).toBe(1)
  await page.locator('#identity-name').fill('API update')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('System identity has been saved and applied.')
  expect(state.writes[0].name).toBe('API update')
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('API update')
  expect(state.reads).toBe(2)
})

test('a saved browser API preference cannot enable requests when the code flag is false', async ({
  page,
}) => {
  const state = await setup(page)
  await page.addInitScript(() => localStorage.setItem('hse-system-identity-use-api', 'true'))
  await page.goto(`${baseURL}/organization/documentation`)
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible()
  expect(state.reads).toBe(0)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue('Browser identity')
  expect(state.reads).toBe(0)
  expect(state.writes).toHaveLength(0)
})
