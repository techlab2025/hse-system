import { expect, test } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://localhost:5173'

for (const step of ['visited', 'ProjectProgressVisited']) {
  test(`${step} dismissal belongs to its organization`, async ({ page }) => {
    await installFixtures(page)
    await page.goto(`${baseURL}/login/organization`)

    const result = await page.evaluate(async (step) => {
      const { useUserStore } = await import('/src/stores/user.ts')
      const { useOrganizationOnboarding } = await import(
        '/src/composables/useOrganizationOnboarding.ts'
      )
      const store = useUserStore()
      localStorage.setItem(step, 'true')
      store.user = { ...store.user, id: 11, organizationId: 101 }
      const guide = useOrganizationOnboarding(step)
      const firstVisit = guide.visited.value
      guide.setVisited()
      const dismissed = guide.visited.value
      const saved = localStorage.getItem(`${step}:organization:101`)
      const reopened = useOrganizationOnboarding(step).visited.value

      store.user = { ...store.user, id: 22, organizationId: 202 }
      const otherOrganization = guide.visited.value
      guide.setVisited()
      store.user = { ...store.user, id: 33, organizationId: 101 }
      const sameOrganizationDifferentUser = guide.visited.value

      store.user = { ...store.user, id: 303, organizationId: undefined }
      const organizationAccountFirstVisit = guide.visited.value
      guide.setVisited()
      const organizationAccountSaved = localStorage.getItem(`${step}:organization:303`)

      store.user = null
      guide.setVisited()
      return {
        firstVisit,
        dismissed,
        saved,
        reopened,
        otherOrganization,
        sameOrganizationDifferentUser,
        organizationAccountFirstVisit,
        organizationAccountSaved,
        loggedOut: guide.visited.value,
        anonymousKey: localStorage.getItem(`${step}:organization:undefined`),
      }
    }, step)

    expect(result).toEqual({
      firstVisit: false,
      dismissed: true,
      saved: 'true',
      reopened: true,
      otherOrganization: false,
      sameOrganizationDifferentUser: true,
      organizationAccountFirstVisit: false,
      organizationAccountSaved: 'true',
      loggedOut: false,
      anonymousKey: null,
    })
  })
}
