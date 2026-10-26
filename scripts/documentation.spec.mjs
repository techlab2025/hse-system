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
  const asset = await page.request.get(`${baseURL}/documentation/projects/project-setup.gif`)
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

const featureCases = [
  {
    slug: 'equipment',
    title: 'Equipment',
    ar: 'المعدات',
    action: 'Open Equipment',
    route: '/organization/equipments',
  },
  {
    slug: 'employee',
    title: 'Employees',
    ar: 'الموظفون',
    action: 'Open Employees',
    route: '/organization/organization-employee?type=3',
  },
  {
    slug: 'observation',
    title: 'Observations',
    ar: 'الملاحظات',
    action: 'Open Observations',
    route: '/organization/equipment-mangement/observation?isAll=1&type=2',
  },
  {
    slug: 'incident',
    title: 'Incidents',
    ar: 'الحوادث',
    action: 'Open Incidents',
    route: '/organization/equipment-mangement/incedant?isAll=1',
  },
]
for (const feature of featureCases) {
  test(`${feature.title} guide opens from the catalog with its real recording and correct feature link`, async ({
    page,
  }) => {
    await installFixtures(page)
    await page.goto(`${baseURL}/organization/documentation`)
    await expect(page.locator('.documentation-guide-card')).toHaveCount(5)
    await page.getByRole('link', { name: `Open guide: ${feature.title}`, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/documentation/${feature.slug}$`))
    await expect(page.getByRole('heading', { name: feature.title, exact: true })).toBeVisible()
    await expect(page.locator('.documentation-steps > li')).toHaveCount(5)
    await expect(page.getByRole('link', { name: feature.action, exact: true })).toHaveAttribute(
      'href',
      feature.route,
    )
    const image = page.locator('.documentation-recording img')
    await expect(image).toHaveAttribute('src', /-poster\.webp$/)
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBe(1152)
    await page.getByRole('button', { name: 'Play walkthrough GIF', exact: true }).click()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/\.gif$/)
    const asset = await page.request.get(`${baseURL}${src}`)
    expect(asset.ok()).toBeTruthy()
    expect((await asset.body()).subarray(0, 6).toString()).toMatch(/^GIF8[79]a$/)
    await page.getByRole('button', { name: 'Stop animation', exact: true }).click()
    await expect(image).toHaveAttribute('src', /-poster\.webp$/)
    await page.locator('.side-rail-nav button[title="Documentation"]').hover()
    await expect(
      page.locator(`.sidebar a[href="/organization/documentation/${feature.slug}"]`).first(),
    ).toBeVisible()
  })
}

test('equipment walkthrough switching stops animation and guide navigation resets the selection', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto(`${baseURL}/organization/documentation/equipment`)
  const image = page.locator('.documentation-recording img')
  const rented = page.getByRole('button', { name: 'Rented equipment', exact: true })
  await rented.click()
  await expect(rented).toHaveAttribute('aria-pressed', 'true')
  await expect(image).toHaveAttribute('src', /equipment-rented-poster\.webp$/)
  await page.getByRole('button', { name: 'Play walkthrough GIF', exact: true }).click()
  await expect(image).toHaveAttribute('src', /equipment-rented\.gif$/)
  const asset = await page.request.get(`${baseURL}/documentation/equipment/equipment-rented.gif`)
  expect(asset.ok()).toBeTruthy()
  expect((await asset.body()).subarray(0, 6).toString()).toMatch(/^GIF8[79]a$/)
  await page.getByRole('button', { name: 'Owned equipment', exact: true }).click()
  await expect(image).toHaveAttribute('src', /equipment-owned-poster\.webp$/)
  await expect(
    page.getByRole('button', { name: 'Play walkthrough GIF', exact: true }),
  ).toBeVisible()
  await rented.click()
  const documentation = page.locator('.side-rail-nav button[title="Documentation"]')
  await documentation.click()
  await page
    .locator('.sidebar a[href="/organization/documentation/employee"]')
    .first()
    .press('Enter')
  await expect(page).toHaveURL(/\/documentation\/employee$/)
  await expect(image).toHaveAttribute('src', /employee-poster\.webp$/)
  await expect(page.locator('#organization-sidebar-pane')).toHaveCount(0)
  await documentation.click()
  await page
    .locator('.sidebar a[href="/organization/documentation/equipment"]')
    .first()
    .press('Enter')
  await expect(image).toHaveAttribute('src', /equipment-owned-poster\.webp$/)
})

test('all new guides have readable Arabic layouts on mobile', async ({ page }) => {
  await installFixtures(page, { locale: 'ar' })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const feature of featureCases) {
    await page.goto(`${baseURL}/organization/documentation/${feature.slug}`)
    await expect(page.getByRole('heading', { name: feature.ar, exact: true })).toBeVisible()
    await expect(page.locator('.documentation-steps > li')).toHaveCount(5)
    expect(
      await page
        .locator('.documentation-page')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBeTruthy()
    await expect(page.locator('.documentation-recording img')).toHaveAttribute(
      'src',
      /-poster\.webp$/,
    )
  }
})

test('employee documentation is available with employee access alone', async ({ page }) => {
  await installFixtures(page, { permitted: false })
  await page.addInitScript(() => {
    const session = JSON.parse(localStorage.getItem('user'))
    session.user.employeeType = 2 // Organization dashboard user, rather than the employee portal.
    session.user.permission = ['OE01'] // ORG_EMPLOYEE_FETCH, without project permissions.
    localStorage.setItem('user', JSON.stringify(session))
  })
  await page.goto(`${baseURL}/organization/documentation/employee`)
  await page.locator('.side-rail-nav button[title="Documentation"]').hover()
  await expect(
    page.locator('.sidebar a[href="/organization/documentation/employee"]').first(),
  ).toBeVisible()
  await expect(page.locator('.sidebar a[href="/organization/documentation/project"]')).toHaveCount(
    0,
  )
})
