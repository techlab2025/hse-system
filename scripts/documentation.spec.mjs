import { test, expect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('Documentation opens the project guide and plays the recorded GIF on request', async ({
  page,
}) => {
  await installFixtures(page)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${baseURL}/organization/documentation`)
  await page.getByRole('link', { name: 'Open guide: Project', exact: true }).click()
  await expect(page).toHaveURL(/\/documentation\/project$/)
  await expect(page.locator('.documentation-steps > li')).toHaveCount(5)
  const recording = page.locator('.documentation-recording img')
  await expect(recording).toHaveAttribute('src', /poster\.webp$/)
  await expect.poll(() => recording.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Play walkthrough GIF' }).click()
  await expect(recording).toHaveAttribute('src', /project-setup\.gif$/)
  await expect.poll(() => recording.evaluate((image) => image.naturalWidth)).toBe(1152)
  await page.getByRole('button', { name: 'Stop animation' }).click()
  await expect(recording).toHaveAttribute('src', /poster\.webp$/)
  await page.locator('.documentation-contents a[href$="#equipment"]').click()
  await expect(page).toHaveURL(/#equipment$/)
  await expect(page.locator('#equipment')).toBeInViewport()
  await expect(page.getByRole('link', { name: 'Open Projects', exact: true })).toHaveAttribute(
    'href',
    '/organization/projects',
  )
  const download = await page.getByRole('link', { name: 'Download GIF' }).getAttribute('href')
  const asset = await page.request.get(`${baseURL}${download}`)
  expect(asset.ok()).toBeTruthy()
  expect((await asset.body()).subarray(0, 6).toString()).toMatch(/^GIF8[79]a$/)
  // The sidebar group is available even with an existing identity layout.
  await page.locator('.side-rail-nav button[title="Documentation"]').hover()
  await expect(
    page.locator('.sidebar a[href="/organization/documentation/project"]').first(),
  ).toBeVisible()
  expect(errors).toEqual([])
})

test('the Arabic guide works on mobile and unknown guides provide a return link', async ({
  page,
}) => {
  await installFixtures(page, { locale: 'ar' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseURL}/organization/documentation/project`)
  await expect(page.getByRole('heading', { name: 'المشروع', exact: true })).toBeVisible()
  await expect(page.locator('.documentation-steps > li')).toHaveCount(5)
  expect(
    await page
      .locator('.documentation-page')
      .evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBeTruthy()
  await expect(page.locator('.documentation-recording img')).toHaveAttribute('src', /poster\.webp$/)
  await page.goto(`${baseURL}/organization/documentation/unknown`)
  await expect(page.getByRole('heading', { name: 'هذا الدليل غير متاح حالياً.' })).toBeVisible()
  await page.getByRole('link', { name: 'العودة إلى التوثيق' }).click()
  await expect(page).toHaveURL(/\/documentation$/)
})
