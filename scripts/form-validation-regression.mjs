/** With Vite running: node scripts/form-validation-regression.mjs [http://127.0.0.1:5180] */
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
const origin = process.argv[2] || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ channel: 'chromium', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`${origin}/scripts/fixtures/form-validation.html`)
  await page.waitForSelector('input.lang-input')
  for (const selector of ['button[type="submit"]', 'button[type="button"].btn-secondary']) {
    await page.locator(selector).click()
    assert.equal(await page.evaluate(() => window.saves), 0)
    assert.equal(await page.evaluate(() => window.loads), 0)
    assert.ok(
      (await page.locator('.required-field-message').allTextContents()).some((s) =>
        s.includes('Root Cause'),
      ),
    )
  }
  await page.evaluate(
    () =>
      (window.formValidation.forms.RootCausesForm.fields.langs.message =
        'Please enter the cause name'),
  )
  await page.locator('button[type="submit"]').click()
  assert.equal(
    await page.locator('.required-field-message').first().textContent(),
    'Please enter the cause name',
  )
  await page.locator('input.lang-input').fill('Guard missing')
  await page.evaluate(() => (window.userStore.user.type = 1))
  await page.locator('button[type="submit"]').click()
  assert.ok(
    (await page.locator('.required-field-message').allTextContents()).some((s) =>
      s.includes('Industry'),
    ),
  )
  assert.equal(await page.evaluate(() => window.saves), 0)
  await page.locator('label[for="title-3"]').click()
  await page.locator('button[type="button"].btn-secondary').click()
  await page.waitForFunction(() => window.saves === 1)
  assert.equal(await page.locator('input.lang-input').inputValue(), '')
  await page.evaluate(() => {
    window.userStore.user.type = 2
    window.formValidation.forms.RootCausesForm.fields.langs.enabled = false
  })
  await page.locator('button[type="submit"]').click()
  await page.waitForFunction(() => window.saves === 2)
  assert.equal(await page.evaluate(() => window.lastRequestValidation.isValid), true)
  await page.evaluate(() => {
    window.userStore.user.type = 2
    return window.router.push('/training')
  })
  await page.waitForSelector('input.lang-input')
  await page.locator('button[type="submit"]').click()
  assert.equal(await page.evaluate(() => window.saves), 2)
  assert.ok((await page.locator('.required-field-message, .text-red-500').count()) > 0)
  // A training topic needs a title in any one language; other translations are optional.
  await page.locator('input.lang-input').fill('Site safety training')
  await page.locator('button[type="button"].btn-secondary').click()
  await page.waitForFunction(() => window.saves === 3)
  assert.equal(await page.evaluate(() => window.lastRequestValidation.isValid), true)
  await page.evaluate(() => (window.formValidation.enabled = false))
  await page.locator('button[type="button"].btn-secondary').click()
  await page.waitForFunction(() => window.saves === 4)
  const core = await page.evaluate(() => {
    window.formValidation.enabled = true
    const key = '__regression__'
    window.requestValidation[key] = {
      enabled: true,
      fields: {
        name: {
          enabled: true,
          required: true,
          minLength: 3,
          message: 'Enter at least three characters',
        },
      },
    }
    const validator = new window.ClassValidation(key)
    const invalid = validator.validate({ name: 'a' })
    const valid = validator.validate({ name: 'abc' })
    window.requestValidation[key].fields.name.enabled = false
    const fieldOff = validator.validate({})
    window.requestValidation[key].enabled = false
    const formOff = validator.validate(null)
    const translated = new window.ClassValidation()
      .require('translation')
      .validate({ translation: new window.TranslationsParams() })
    const scopedParams = {}
    window.formValidation.forms.TestForm = { enabled: false, fields: {} }
    window.setFormValidationScope(scopedParams, 'TestForm')
    window.requestValidation[key].enabled = true
    window.requestValidation[key].fields.name.enabled = true
    const scopedOff = validator.validate(scopedParams)
    const zeroFalse = new window.ClassValidation()
      .require('count')
      .require('active')
      .validate({ count: 0, active: false })
    return { invalid, valid, fieldOff, formOff, translated, zeroFalse, scopedOff }
  })
  assert.equal(core.invalid.isValid, false)
  assert.equal(core.invalid.errors[0].message, 'Enter at least three characters')
  assert.equal(core.valid.isValid, true)
  assert.equal(core.fieldOff.isValid, true)
  assert.equal(core.formOff.isValid, true)
  assert.equal(core.translated.isValid, false)
  assert.equal(core.zeroFalse.isValid, true)
  assert.equal(core.scopedOff.isValid, true)
  assert.deepEqual(errors, [])
  console.log(
    'PASS: Save and Save & New block before loading; inline errors; editable messages; successful reset; field/global switches; training form; request constraints; multilingual blanks; valid zero/false.',
  )
} finally {
  await browser.close()
}
