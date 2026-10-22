import { test, expect as baseExpect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const expect = baseExpect.configure({ timeout: 15000 })
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

async function setupEmployee(page) {
  await installFixtures(page, { permitted: false })
  await page.goto(`${baseURL}/organization/employee-interface`)
  await expect(page.locator('.employee-interface-wrapper')).toBeVisible()
}

test('employee navigation outside the home features returns home, including direct URLs', async ({
  page,
}) => {
  await setupEmployee(page)
  for (const path of [
    '/organization/project-details/433',
    '/organization/Investigating-result/1',
    '/organization/project/add',
    '/organization/system-identity',
    '/organization/organization-employee-tasks/2',
    '/admin/ppe-tools',
    '/organization/not-a-feature',
  ]) {
    await page.evaluate(async (path) => {
      const { default: router } = await import('/src/router/index.ts')
      await router.push(path)
    }, path)
    await expect(page).toHaveURL(`${baseURL}/organization/employee-interface`)
  }
  await page.goto(`${baseURL}/organization/project-details/433?tab=leadership`)
  await expect(page).toHaveURL(`${baseURL}/organization/employee-interface`)
  await expect(page.locator('.employee-interface-wrapper')).toBeVisible()
})

test('employee home cards and their add, edit and detail workflows pass the guard', async ({
  page,
}) => {
  await setupEmployee(page)
  const paths = [
    '/organization/employee-interface',
    '/organization/organization-employee-tasks/1',
    '/organization/equipment-mangement/inspection?inspectionType=2',
    '/organization/equipment-mangement/inspection/add',
    '/organization/equipment-mangement/inspection/result/1',
    '/organization/equipment-mangement/observation?isAll=1',
    '/organization/equipment-mangement/observation/add',
    '/organization/equipment-mangement/observation/show/1',
    '/organization/equipment-mangement/observation/1',
    '/organization/equipment-mangement/incedant?isAll=1',
    '/organization/equipment-mangement/incedant/add',
    '/organization/equipment-mangement/incedant/show/1',
    '/organization/inductions',
    '/organization/induction/add',
    '/organization/induction/show/1',
    '/organization/management-of-change',
    '/organization/management-of-change/add',
    '/organization/management-of-change/1',
    '/organization/project-permit/create?project_id=433',
    '/organization/project-my-permits/433',
    '/organization/project-permit/project/templates',
    '/organization/project-permit/project/templates/answer',
    '/organization/project-details/433/leadership',
    '/organization/project-details/433/leadership/visits',
    '/organization/project-details/433/leadership/visits/1/report',
    '/organization/risk-assessments/create',
    '/organization/project-details/433/risk-assessments',
    '/organization/project-details/433/risk-assessments/create',
  ]
  const decisions = await page.evaluate(async (paths) => {
    const { default: router } = await import('/src/router/index.ts')
    const { authGuard } = await import('/src/router/guards.ts')
    return paths.map((path) => {
      const to = router.resolve(path)
      let decision = 'guard did not finish'
      authGuard(to, router.currentRoute.value, (result) => {
        decision = result ?? 'allowed'
      })
      return { path, name: to.name, decision }
    })
  }, paths)
  for (const result of decisions) expect(result, result.path).toMatchObject({ decision: 'allowed' })
})

test('organization admins and masters keep access to organization pages', async ({ page }) => {
  await setupEmployee(page)
  const decisions = await page.evaluate(async () => {
    const { default: router } = await import('/src/router/index.ts')
    const { authGuard } = await import('/src/router/guards.ts')
    const { useUserStore } = await import('/src/stores/user.ts')
    const store = useUserStore()
    const results = []
    for (const role of [
      { isMaster: 1, employeeType: 1 },
      { isMaster: 0, employeeType: 2 },
    ]) {
      Object.assign(store.user, role)
      for (const path of [
        '/organization/project-details/433',
        '/organization/Investigating-result/1',
      ]) {
        authGuard(router.resolve(path), router.currentRoute.value, (result) => {
          results.push(result ?? 'allowed')
        })
      }
    }
    return results
  })
  expect(decisions).toEqual(['allowed', 'allowed', 'allowed', 'allowed'])
})
