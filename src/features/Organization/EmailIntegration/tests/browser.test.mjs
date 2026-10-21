import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { installFixtures } from '../../Project/tests/project-fixtures.mjs'
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] })
const baseURL = process.env.EMAIL_TEST_URL || 'http://127.0.0.1:5190'
const model = {
  version: 3,
  enabled: true,
  status: 'saved',
  updated_at: '2026-10-21T10:00:00Z',
  has_password: true,
  has_imap_password: false,
  can_manage: true,
  config: {
    host: 'smtp.example.com',
    port: 587,
    security: 'starttls',
    username: 'sender@example.com',
    from_email: 'sender@example.com',
    from_name: 'HSE',
    reply_to: null,
    translations: { from_name: { ar: 'إشعارات', en: 'HSE' } },
    sent_copy: {
      enabled: true,
      host: 'imap.example.com',
      port: 993,
      use_smtp_credentials: true,
      username: '',
      folder: '',
    },
  },
  sent_copies: { pending: 0, failed: 2, saved: 10 },
}
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await installFixtures(page)
const requests = []
let conflict = false
let manage = true
let failLoad = false
await page.route(
  'https://api.hse.techlabeg.com/organization/integrations/email{,/**}',
  async (route) => {
    const request = route.request()
    const method = request.method()
    const path = new URL(request.url()).pathname
    if (method === 'GET')
      return route.fulfill({
        status: failLoad ? 503 : 200,
        json: failLoad
          ? { message: 'Service unavailable' }
          : { status: true, data: { ...model, can_manage: manage } },
      })
    const body = request.postDataJSON()
    requests.push({ method, path, body })
    if (method === 'PUT')
      return route.fulfill({
        status: conflict ? 409 : 200,
        json: conflict
          ? { status: false, message: 'Email settings changed. Discard your changes and reload.' }
          : {
              status: true,
              data: {
                ...model,
                version: model.version + 1,
                enabled: body.enabled,
                config: body.config,
              },
            },
      })
    return route.fulfill({
      json: {
        status: true,
        data: path.endsWith('sent-check')
          ? { folder: 'INBOX.Sent' }
          : { sent_copies: { saved: 10, failed: 0, pending: 2 } },
      },
    })
  },
)
try {
  await page.goto(`${baseURL}/organization/integrations/email`)
  await page.locator('#smtp-host').waitFor()
  assert.equal(await page.locator('#smtp-host').inputValue(), 'smtp.example.com')
  const nameInput = page.locator('.email-sender-name .lang-input')
  await nameInput.fill('HSE Operations')
  await page.locator('.email-sender-name .input-lang:has(input[value="ar"]) label').click()
  assert.equal(await nameInput.inputValue(), 'إشعارات')
  await nameInput.fill('إشعارات السلامة')
  await page.locator('.email-sender-name .input-lang:has(input[value="en"]) label').click()
  assert.equal(await nameInput.inputValue(), 'HSE Operations')
  await page.locator('#smtp-security').selectOption('tls')
  assert.equal(await page.locator('#smtp-port').inputValue(), '465')
  await page.locator('#smtp-confirm').fill('test-confirm')
  await page.getByRole('button', { name: 'Save email settings', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Email settings saved.' }).waitFor()
  const save = requests.find((r) => r.method === 'PUT')
  assert.equal(save.body.version, 3)
  assert.equal(save.body.config.port, 465)
  assert.equal(save.body.config.translations.from_name.en, 'HSE Operations')
  assert.equal(save.body.config.translations.from_name.ar, 'إشعارات السلامة')
  assert.equal(save.body.config.from_name, 'إشعارات السلامة')
  assert.equal('password' in save.body.config, false)
  assert.equal('password' in save.body.config.sent_copy, false)
  assert.equal(await page.locator('#smtp-confirm').inputValue(), '')
  await page.locator('#smtp-confirm').fill('test-confirm')
  await page.getByRole('button', { name: 'Check Sent folder', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'IMAP and Sent folder checked.' }).waitFor()
  assert.deepEqual(requests.at(-1).body, { current_password: 'test-confirm' })
  assert.equal(await page.locator('#smtp-confirm').inputValue(), '')
  await page.locator('#smtp-confirm').fill('test-confirm')
  await page.getByRole('button', { name: 'Retry failed Sent copies only', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Failed copies were requeued.' }).waitFor()
  assert.equal(
    await page.getByRole('button', { name: 'Retry failed Sent copies only', exact: true }).count(),
    0,
  )
  await page.locator('#smtp-user').fill('changed@example.com')
  await page.locator('#smtp-password').fill('new-test-secret')
  await page.locator('#smtp-confirm').fill('test-confirm')
  conflict = true
  await page.getByRole('button', { name: 'Save email settings', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'Email settings changed.' }).waitFor()
  assert.equal(await page.locator('#smtp-user').inputValue(), 'changed@example.com')
  assert.equal(await page.locator('#smtp-password').inputValue(), '')
  assert.equal(await page.locator('#smtp-confirm').inputValue(), '')
  await page.locator('.email-back').click()
  assert.equal(new URL(page.url()).pathname, '/organization/integrations/email')
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click()
  assert.equal(await page.locator('#smtp-user').inputValue(), 'sender@example.com')
  await page.locator('#imap-reuse').uncheck()
  await page.locator('#imap-user').waitFor()
  assert.equal((await page.locator('#imap-password').getAttribute('required')) !== null, true)
  await page.getByRole('button', { name: 'Discard changes', exact: true }).click()
  await page.screenshot({ path: '/tmp/hse-email-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(
    await page.locator('.email-settings').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    true,
  )
  manage = false
  await page.getByRole('button', { name: 'Reload saved settings', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'You can view these settings.' }).waitFor()
  assert.equal(await page.locator('#smtp-host').isDisabled(), true)
  assert.deepEqual(errors, [])
  const ar = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await installFixtures(ar, { locale: 'ar' })
  await ar.route('https://api.hse.techlabeg.com/organization/integrations/email', (r) =>
    r.fulfill({ json: { status: true, data: model } }),
  )
  await ar.goto(`${baseURL}/organization/integrations/email`)
  await ar.locator('#smtp-host').waitFor()
  assert.equal(await ar.locator('.email-settings').getAttribute('dir'), 'rtl')
  assert.equal(
    await ar.locator('.email-settings').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    true,
  )
  await ar.close()
  // Empty successful responses show a writable setup form and save with version zero.
  for (const empty of [null, [], {}, undefined]) {
    const setup = await browser.newPage()
    await installFixtures(setup)
    let firstSave
    await setup.route('https://api.hse.techlabeg.com/organization/integrations/email', (route) => {
      if (route.request().method() === 'GET')
        return route.fulfill({ json: { status: true, data: empty } })
      firstSave = route.request().postDataJSON()
      return route.fulfill({
        json: { status: true, data: { ...model, version: 1, config: firstSave.config } },
      })
    })
    await setup.goto(`${baseURL}/organization/integrations/email`)
    await setup.locator('#smtp-host').waitFor()
    assert.equal(await setup.locator('#smtp-host').isEnabled(), true)
    assert.equal(await setup.locator('#smtp-host').inputValue(), '')
    assert.equal(await setup.locator('#smtp-port').inputValue(), '587')
    assert.equal(await setup.getByRole('alert').count(), 0)
    if (empty === null) {
      await setup.locator('#smtp-host').fill('smtp.example.com')
      await setup.locator('#smtp-user').fill('sender@example.com')
      await setup.locator('#smtp-password').fill('test-new-password')
      await setup.locator('.email-sender-name .lang-input').fill('Manual sender')
      await setup.locator('#smtp-from-email').fill('sender@example.com')
      await setup.locator('#smtp-confirm').fill('test-confirm')
      await setup.getByRole('button', { name: 'Save email settings', exact: true }).click()
      await setup.getByRole('status').filter({ hasText: 'Email settings saved.' }).waitFor()
      assert.equal(firstSave.version, 0)
      assert.equal(firstSave.config.from_name, 'Manual sender')
      assert.equal(firstSave.config.password, 'test-new-password')
      assert.equal(await setup.locator('#smtp-password').inputValue(), '')
    }
    await setup.close()
  }
  // A real HTTP 404 also opens manual setup; a failed save must remain an error.
  const notFound = await browser.newPage()
  await installFixtures(notFound)
  await notFound.route('https://api.hse.techlabeg.com/organization/integrations/email', (r) =>
    r.fulfill({ status: 404, json: { message: 'Not Found' } }),
  )
  await notFound.goto(`${baseURL}/organization/integrations/email`)
  await notFound.locator('#smtp-host').waitFor()
  assert.equal(await notFound.locator('#smtp-host').isEnabled(), true)
  assert.equal(await notFound.getByRole('alert').count(), 0)
  await notFound.locator('#smtp-host').fill('smtp.example.com')
  await notFound.locator('#smtp-user').fill('sender@example.com')
  await notFound.locator('#smtp-password').fill('test-new-password')
  await notFound.locator('.email-sender-name .lang-input').fill('Manual sender')
  await notFound.locator('#smtp-from-email').fill('sender@example.com')
  await notFound.locator('#smtp-confirm').fill('test-confirm')
  await notFound.getByRole('button', { name: 'Save email settings', exact: true }).click()
  await notFound.getByRole('alert').filter({ hasText: 'Not Found' }).waitFor()
  assert.equal(await notFound.locator('#smtp-host').inputValue(), 'smtp.example.com')
  await notFound.close()
  // Explicit server denial still wins for an empty response.
  const denied = await browser.newPage()
  await installFixtures(denied)
  await denied.route('https://api.hse.techlabeg.com/organization/integrations/email', (r) =>
    r.fulfill({ json: { status: true, data: null, can_manage: false } }),
  )
  await denied.goto(`${baseURL}/organization/integrations/email`)
  await denied.locator('#smtp-host').waitFor()
  assert.equal(await denied.locator('#smtp-host').isDisabled(), true)
  await denied.close()
  // Initial failure offers retry without exposing an editable default form.
  const failed = await browser.newPage()
  await installFixtures(failed)
  let loadFails = true
  await failed.route('https://api.hse.techlabeg.com/organization/integrations/email', (r) =>
    r.fulfill({
      status: loadFails ? 503 : 200,
      json: loadFails ? { message: 'Service unavailable' } : { status: true, data: model },
    }),
  )
  await failed.goto(`${baseURL}/organization/integrations/email`)
  await failed.getByRole('alert').filter({ hasText: 'Service unavailable' }).waitFor()
  assert.equal(await failed.locator('#smtp-host').count(), 0)
  loadFails = false
  await failed.getByRole('button', { name: 'Reload saved settings', exact: true }).click()
  await failed.locator('#smtp-host').waitFor()
  await failed.close()
  console.log(
    'Email integration browser checks passed: save, secret omission/clearing, check/retry, conflict, navigation guard, IMAP branches, read-only, failure recovery, mobile and Arabic.',
  )
} finally {
  await browser.close()
}
