import { test, expect } from '@playwright/test'
import { useIdentityApiCodeFlag } from './fixtures/system-identity-api-mode.mjs'
import { readFileSync } from 'node:fs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const example = JSON.parse(
  readFileSync(new URL('../docs/examples/system-identity-request.json', import.meta.url), 'utf8'),
)
const sample = () => structuredClone(example)
const enableApi = useIdentityApiCodeFlag
const cache = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity')))
const resource = (identity) => ({
  status: true,
  message: 'System identity loaded.',
  data: { identity, updated_at: null },
})
const navigate = (page, path) =>
  page.evaluate(
    (path) => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(path),
    path,
  )

async function backend(page, initial = sample()) {
  await installFixtures(page)
  const state = { identity: initial, fetches: 0, writes: [], failure: false, loadFailure: false }
  await page.route('**/organization/*system_identity', async (route) => {
    expect(route.request().method()).toBe('POST')
    if (route.request().url().endsWith('/fetch_system_identity')) {
      state.fetches++
      expect(route.request().postDataJSON()).toEqual({})
      return route.fulfill({
        status: state.loadFailure ? 503 : 200,
        json: state.loadFailure
          ? { status: false, message: 'Identity unavailable' }
          : resource(state.identity),
      })
    }
    const body = route.request().postDataJSON()
    state.writes.push(body)
    if (state.failure)
      return route.fulfill({
        status: 422,
        json: {
          status: false,
          message: 'Identity name rejected',
          errors: { name: ['Identity name rejected'] },
        },
      })
    state.identity = body
    return route.fulfill({ json: resource(state.identity) })
  })
  return state
}

for (const loadFailure of [false, true]) {
  test(`organization login waits for identity before navigating (${loadFailure ? 'fetch failure' : 'success'})`, async ({
    page,
  }) => {
    const state = await backend(page)
    state.loadFailure = loadFailure
    await page.addInitScript(() => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    })
    await page.route('**/organization/login', (route) =>
      route.fulfill({
        json: {
          status: true,
          data: {
            id: 1,
            name: 'Identity login test',
            email: 'identity@example.com',
            api_token: 'identity-login-token',
            type: 2,
            employee_type: 1,
            is_master: 1,
            permissions: [],
            languages: [],
          },
        },
      }),
    )
    let release
    const pending = new Promise((resolve) => {
      release = resolve
    })
    let fetchStarted = false
    await page.route('**/organization/fetch_system_identity', async (route) => {
      expect(route.request().headers().authorization).toBe('Bearer identity-login-token')
      fetchStarted = true
      await pending
      await route.fallback()
    })
    await page.goto(`${baseURL}/login/organization`)
    await page.locator('#email').fill('identity@example.com')
    await page.locator('#password').fill('fixture-password')
    await page.locator('button[type="submit"]').click()
    await expect.poll(() => fetchStarted).toBe(true)
    await expect(page).toHaveURL(`${baseURL}/login/organization`)
    release()
    await expect(page).toHaveURL(`${baseURL}/organization`)
    await expect.poll(() => state.fetches).toBe(1)
    await expect
      .poll(() =>
        page.locator('html').evaluate((el) => el.style.getPropertyValue('--identity-primary')),
      )
      .toBe(loadFailure ? '#246bfe' : example.primaryColor)
    await navigate(page, '/organization/system-identity')
    await expect(page.locator('#identity-name')).toHaveValue(
      loadFailure ? 'HSE.Cloud.Ai' : example.name,
    )
    expect(state.fetches).toBe(1)
  })
}

for (const shape of ['array', 'flat']) {
  test(`${shape} API identity displays its base64 logo in the header and editor`, async ({
    page,
  }) => {
    await backend(page)
    const logo =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCWQAAAAASUVORK5CYII='
    const value = { ...sample(), logo, updated_at: '2026-10-27T12:15:39Z' }
    await page.route('**/organization/fetch_system_identity', (route) =>
      route.fulfill({
        json: {
          status: true,
          message: 'System identity loaded.',
          data: shape === 'array' ? [value] : value,
        },
      }),
    )
    await page.goto(`${baseURL}/organization/documentation`)
    const image = page.locator('.brand-link img')
    await expect(image).toHaveAttribute('src', logo)
    await expect(image).toBeVisible()
    await expect(image).toHaveJSProperty('naturalWidth', 1)
    await expect.poll(() => cache(page)).toMatchObject({ logo, name: value.name })
    await navigate(page, '/organization/system-identity')
    await expect(page.locator('#identity-name')).toHaveValue(value.name)
    await expect(page.locator(`img[src="${logo}"]`).first()).toBeVisible()
  })
}

test('organization entry applies the server identity before opening the editor, with one fetch across routes', async ({
  page,
}) => {
  const state = await backend(page)
  await page.goto(`${baseURL}/organization/documentation`)
  await expect
    .poll(() =>
      page.locator('html').evaluate((el) => el.style.getPropertyValue('--identity-primary')),
    )
    .toBe(example.primaryColor)
  await expect(page.locator('.side-rail-btn[title="Safety workspace"]')).toBeVisible()
  await expect
    .poll(() => cache(page))
    .toMatchObject({
      name: example.name,
      appearance: { sidebarItemParents: example.appearance.sidebarItemParents },
    })
  await navigate(page, '/organization/system-identity')
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  expect(state.fetches).toBe(1)
})

test('save sends the entire local JSON including nested layout, false, empty strings and null; reset persists defaults', async ({
  page,
}) => {
  const state = await backend(page)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  await page.locator('#identity-name').fill('  Updated organization  ')
  await page.locator('label[for="identity-active"] .toggle').click()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('System identity has been saved and applied.')
  expect(state.writes).toHaveLength(1)
  const body = state.writes[0]
  expect(body).toEqual(await cache(page))
  expect(body).toMatchObject({
    name: 'Updated organization',
    logo: '',
    isActive: false,
    extractedColors: [],
    appearance: {
      typography: { fontSize: null, headingSize: null, fontColor: '' },
      sidebarCustomGroups: example.appearance.sidebarCustomGroups,
      sidebarItemParents: example.appearance.sidebarItemParents,
      sidebarLabels: example.appearance.sidebarLabels,
    },
  })
  expect(Object.keys(body)).toHaveLength(8)
  expect(body.appearance.headerOrder).toEqual(example.appearance.headerOrder)
  expect(body.appearance.headerActionOrder).toEqual(example.appearance.headerActionOrder)
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('Updated organization')
  await expect(page.locator('#identity-active')).not.toBeChecked()
  await page.getByRole('button', { name: 'Reset identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Default system identity has been restored.')
  expect(state.writes).toHaveLength(2)
  expect(state.writes[1]).toMatchObject({
    name: 'HSE.Cloud.Ai',
    isActive: true,
    appearance: { sidebarCustomGroups: [], sidebarItemParents: {}, sidebarLabels: {} },
  })
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('HSE.Cloud.Ai')
})

test('a failed save preserves the draft and last applied identity, and can be retried', async ({
  page,
}) => {
  const state = await backend(page)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  const applied = await cache(page)
  state.failure = true
  await page.locator('#identity-name').fill('Unsaved draft')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Your draft is still here.')
  await expect(page.locator('#identity-name')).toHaveValue('Unsaved draft')
  expect(await cache(page)).toEqual(applied)
  state.failure = false
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('System identity has been saved and applied.')
  expect((await cache(page)).name).toBe('Unsaved draft')
})

test('fetch failure keeps the matching cache, reports failure, and retry applies server settings', async ({
  page,
}) => {
  const state = await backend(page)
  state.loadFailure = true
  await page.addInitScript((value) => {
    localStorage.setItem(
      'hse-system-identity:user:1',
      JSON.stringify({ ...value, name: 'Cached organization' }),
    )
    localStorage.setItem('hse-system-identity-owner', 'user:1')
  }, example)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.getByRole('alert')).toContainText('Could not load the organization identity')
  await expect(page.locator('#identity-name')).toHaveValue('Cached organization')
  state.loadFailure = false
  await page.getByRole('button', { name: 'Retry loading', exact: true }).click()
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(state.fetches).toBe(2)
})

test('an organization with no saved identity uses HSE defaults instead of another organization cache', async ({
  page,
}) => {
  await backend(page, null)
  await page.addInitScript((value) => {
    localStorage.setItem('hse-system-identity', JSON.stringify(value))
    localStorage.setItem('hse-system-identity-owner', 'organization:99')
    localStorage.setItem('hse-system-identity:organization:99', JSON.stringify(value))
  }, example)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue('HSE.Cloud.Ai')
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('hse-system-identity:organization:99')).name,
    ),
  ).toBe(example.name)
  expect((await cache(page)).appearance.sidebarCustomGroups).toEqual([])
})

test('a late fetch from the previous organization cannot replace the new organization identity', async ({
  page,
}) => {
  await installFixtures(page)
  await enableApi(page)
  let release
  const delayed = new Promise((resolve) => {
    release = resolve
  })
  let calls = 0
  await page.route('**/organization/fetch_system_identity', async (route) => {
    const call = ++calls
    if (call === 1) await delayed
    return route.fulfill({
      json: resource({
        ...sample(),
        name: call === 1 ? 'Previous organization' : 'Current organization',
      }),
    })
  })
  await page.goto(`${baseURL}/organization/documentation`)
  await expect.poll(() => calls).toBe(1)
  await page.evaluate(() => {
    const store = document
      .querySelector('#app')
      .__vue_app__.config.globalProperties.$pinia._s.get('user')
    store.setUser({ ...store.user, id: 2, organizationId: 22, apiToken: 'second-fixture-session' })
  })
  await expect.poll(() => cache(page)).toMatchObject({ name: 'Current organization' })
  const previousResponse = page.waitForResponse((response) =>
    response.url().endsWith('/fetch_system_identity'),
  )
  release()
  await previousResponse
  expect((await cache(page)).name).toBe('Current organization')
  expect(calls).toBe(2)
})

test('malformed fetch settings cannot erase an existing matching identity cache', async ({
  page,
}) => {
  await backend(page, { name: 'Incomplete response' })
  await page.addInitScript((value) => {
    localStorage.setItem('hse-system-identity:user:1', JSON.stringify(value))
  }, example)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.getByRole('alert')).toContainText('invalid system identity response')
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  expect((await cache(page)).appearance.sidebarCustomGroups).toEqual(
    example.appearance.sidebarCustomGroups,
  )
})

test('unavailable browser storage does not turn a successful server save into a failed save', async ({
  page,
}) => {
  const state = await backend(page)
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('hse-system-identity'))
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      return original.call(this, key, value)
    }
  })
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue(example.name)
  await page.locator('#identity-name').fill('Server saved identity')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(
    page.getByText('System identity has been saved and applied.', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText(/browser cache could not be updated/)).toBeVisible()
  expect(state.identity.name).toBe('Server saved identity')
  await page.reload()
  await expect(page.locator('#identity-name')).toHaveValue('Server saved identity')
})

test('legacy local settings are claimed once and remain available when the new endpoint is unavailable', async ({
  page,
}) => {
  const state = await backend(page)
  state.loadFailure = true
  await page.addInitScript((value) => {
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({ ...value, name: 'Legacy identity' }),
    )
  }, example)
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-name')).toHaveValue('Legacy identity')
  await expect(page.getByRole('alert')).toContainText('Could not load the organization identity')
  expect(await page.evaluate(() => localStorage.getItem('hse-system-identity-owner'))).toBe(
    'user:1',
  )
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity:user:1')).name),
  ).toBe('Legacy identity')
})
