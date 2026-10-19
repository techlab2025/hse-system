import { test, expect, type Page } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'
async function setup(page: Page) {
  await page.route('https://api.hse.techlabeg.com/**', route => route.fulfill({status: 404, json: {status: false, message: 'Unconfigured test request'}}))
  await page.goto(`${origin}/login/organization`)
  await page.locator('#app').locator('form').first().waitFor()
  await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const store = useUserStore()
    store.$patch({ isAuth: true, user: { id: 900001, name: 'Permission fixture', type: 2, employeeType: 2, apiToken: 'local-test-only', isMaster: 0, permission: [], permissionsLoaded: true }, permissionsLoading: false, permissionsInvalidated: false })
  })
}

test('single, ANY, ALL deny missing/loading/invalid state and keep CRUD independent', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { can, canAny, canAll } = await import('/src/features/permission/Presentation/Helpers/organization_permission.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const context = { isAuth: true, user: { permission: [P.PROJECT_FETCH], permissionsLoaded: true, isMaster: 0 } }
    return {
      allowed: can(P.PROJECT_FETCH, context), create: can(P.PROJECT_CREATE, context), edit: can(P.PROJECT_UPDATE, context),
      any: canAny([P.PROJECT_CREATE, P.PROJECT_FETCH], context), all: canAll([P.PROJECT_FETCH, P.PROJECT_CREATE], context),
      emptyAny: canAny([], context), emptyAll: canAll([], context), missing: can(P.PROJECT_FETCH, { isAuth: true, user: null }),
      loading: can(P.PROJECT_FETCH, { ...context, loading: true }), unloaded: can(P.PROJECT_FETCH, { ...context, user: { ...context.user, permissionsLoaded: false } }),
      invalidated: can(P.PROJECT_FETCH, { ...context, invalidated: true }), malformed: can(P.PROJECT_FETCH, { ...context, user: { permission: [1] } }),
      unknown: can('UNKNOWN', context), masterKnown: can(P.PROJECT_CREATE, { ...context, user: { permission: [], isMaster: 1 } }),
      masterUnknown: can('UNKNOWN', { ...context, user: { permission: [], isMaster: 1 } }),
      emailBypass: can(P.PROJECT_CREATE, { ...context, user: { permission: [], email: 'admin@example.test' } }),
    }
  })
  expect(result).toEqual({ allowed: true, create: false, edit: false, any: true, all: false, emptyAny: false, emptyAll: false, missing: false, loading: false, unloaded: false, invalidated: false, malformed: false, unknown: false, masterKnown: true, masterUnknown: false, emailBypass: false })
})

test('every registered route and API policy accepts only its explicit grants', async ({ page }) => {
  await setup(page)
  const failures = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { canPolicy } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    const { organizationApiPolicies, organizationRoutePolicies } = await import('/src/features/permission/Core/organizationPolicies.ts')
    const store = useUserStore()
    const failures: string[] = []
    for (const [name, policy] of Object.entries({ ...organizationRoutePolicies, ...organizationApiPolicies })) {
      store.setPermissions([])
      if (canPolicy(policy) !== !!policy.authenticated) failures.push(`${name}: empty grants`)
      if (policy.unsupported) continue
      for (const grant of policy.anyOf ?? []) {
        store.setPermissions([grant])
        if (!canPolicy(policy)) failures.push(`${name}: denied explicit grant`)
      }
    }
    return failures
  })
  expect(failures).toEqual([])
})

test('all runtime organization routes have an explicit policy, including generated location routes', async ({ page }) => {
  await setup(page)
  const missing = await page.evaluate(async () => {
    const { default: router } = await import('/src/router/index.ts')
    const { organizationRoutePolicy } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    return router.getRoutes().filter(route => route.path.startsWith('/organization') && !organizationRoutePolicy({ ...route, params: {}, query: {} })).map(route => String(route.name))
  })
  expect(missing).toEqual([])
})

test('role markers cannot substitute feature permissions; observation types are isolated', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: handler } = await import('/src/base/Presentation/utils/permission_handler.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const { canOrganizationApi } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    const store = useUserStore()
    store.setPermissions([P.ORGANIZATION_EMPLOYEE])
    const role = handler.Instance.handle([P.ORGANIZATION_EMPLOYEE, P.PROJECT_CREATE])
    store.setPermissions([P.ORG_OBSERVATION_FETCH])
    return { role, observation: canOrganizationApi('fetch_observations', {type: [1]}), incident: canOrganizationApi('fetch_observations', {type: [3]}), mixed: canOrganizationApi('fetch_observations', {type: [1, 3]}), create: canOrganizationApi('create_observation', {type: 1}) }
  })
  expect(result).toEqual({ role: false, observation: true, incident: false, mixed: false, create: false })
})

test('direct create route and programmatic mutation are blocked without sending a request', async ({ page }) => {
  await setup(page)
  let sent = 0
  await page.route('**/organization/create_project*', async route => { sent++; await route.abort() })
  const blocked = await page.evaluate(async () => {
    const { default: Service } = await import('/src/base/Data/ApiService/api_service_interface.ts')
    const { default: router } = await import('/src/router/index.ts')
    class TestService extends Service { applyService() { return this.call({ url: 'https://api.hse.techlabeg.com/organization/create_project', type: 'post', auth: true, params: { toMap: () => ({ name: 'never sent' }) } }) } }
    let denied = false
    try { await new TestService().applyService() } catch { denied = true }
    const route = router.getRoutes().find(route => route.name === 'Add Project')
    await router.push(route ? { name: route.name } : '/organization/projects/add')
    return { denied, route: String(router.currentRoute.value.name) }
  })
  expect(blocked).toEqual({ denied: true, route: 'Access Denied Organization' })
  expect(sent).toBe(0)
})

test('assignment response must identify account scope and preserve unrelated permissions', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { default: Model } = await import('/src/features/permission/Data/models/PermissionDetailsModel.ts')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { validatePermissionChanges } = await import('/src/features/permission/Presentation/Helpers/organization_permission.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    store.setPermissions([P.PERMISSION_UPDATE, P.PROJECT_FETCH])
    return { unscoped: Model.fromMap([{ permission: P.PROJECT_FETCH }]).isScopedTo(2, 1074), scoped: Model.fromMap({type: 2, type_id: 1074, permissions: [P.PROJECT_FETCH]}).isScopedTo(2, 1074), preserve: validatePermissionChanges(['legacy:unknown'], ['legacy:unknown', P.PROJECT_FETCH]), removeUnknown: validatePermissionChanges(['legacy:unknown'], []), escalate: validatePermissionChanges([], [P.PROJECT_CREATE]) }
  })
  expect(result).toEqual({ unscoped: false, scoped: true, preserve: true, removeUnknown: false, escalate: false })
})

test('permission refresh rejects unscoped catalogues and logout clears grants', async ({ page }) => {
  await setup(page)
  await page.route('**/show_permissions', route => route.fulfill({json: {status: true, data: [{permission: 'PJ00'}]}}))
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { refreshOrganizationPermissions } = await import('/src/features/permission/Presentation/Helpers/refresh_organization_permissions.ts')
    const { can } = await import('/src/features/permission/Presentation/Helpers/organization_permission.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    store.setPermissions([P.PROJECT_FETCH])
    const refreshed = await refreshOrganizationPermissions()
    const afterRefresh = can(P.PROJECT_FETCH)
    await store.logout()
    return { refreshed, afterRefresh, loggedOut: !store.isAuth && !store.user }
  })
  expect(result).toEqual({ refreshed: false, afterRefresh: false, loggedOut: true })
})

test('permission editor searches, preserves unknown grants and never synthesizes All', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick } = await import('/node_modules/.vite/deps/vue.js')
    const { default: Editor } = await import('/src/features/permission/Presentation/supcomponents/PermissionTabContent.vue')
    const { default: router } = await import('/src/router/index.ts')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    useUserStore().$patch({ user: { ...useUserStore().user, isMaster: 1 } })
    await router.push({name: 'Access Denied Organization'})
    const host = document.createElement('div'); document.body.appendChild(host)
    let emitted: string[] = []
    const app = createApp({ render: () => h(Editor, {permissions: [{id: 0, permission: 'legacy:unknown'}], availablePermissions: [P.PROJECT_FETCH, P.PROJECT_CREATE, P.PROJECT_UPDATE, P.PROJECT_DELETE, P.PROJECT_DETAILS, P.PROJECT_ALL], 'onUpdate:permissions': (codes: string[]) => emitted = codes}) })
    app.use(router); app.config.globalProperties.$t = (key: string) => key
    app.mount(host); await nextTick()
    const input = host.querySelector<HTMLInputElement>(`[data-permission="${P.PROJECT_FETCH}"]`)!
    input.checked = true; input.dispatchEvent(new Event('change', {bubbles: true})); await nextTick()
    const independent = emitted.includes(P.PROJECT_FETCH) && !emitted.includes(P.PROJECT_ALL) && emitted.includes('legacy:unknown')
    const search = host.querySelector<HTMLInputElement>('#permission-search')!
    search.value = 'impossible_no_such_feature'; search.dispatchEvent(new Event('input', {bubbles: true})); await nextTick()
    const searched = host.querySelectorAll('[data-permission]').length === 0
    app.unmount(); host.remove()
    return { independent, searched }
  })
  expect(result).toEqual({ independent: true, searched: true })
})

test('shared permission wrapper reacts immediately to grants and revocation', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick } = await import('/node_modules/.vite/deps/vue.js')
    const { default: Wrapper } = await import('/src/shared/HelpersComponents/PermissionBuilder.vue')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    const host = document.createElement('div'); document.body.appendChild(host)
    const app = createApp({render: () => h(Wrapper, {code: [P.PROJECT_CREATE]}, {default: () => h('button', 'Create fixture')})})
    app.mount(host); await nextTick()
    const denied = !host.querySelector('button')
    store.setPermissions([P.PROJECT_CREATE]); await nextTick()
    const granted = !!host.querySelector('button')
    store.invalidatePermissions(); await nextTick()
    const revoked = !host.querySelector('button')
    app.unmount(); host.remove()
    return { denied, granted, revoked }
  })
  expect(result).toEqual({ denied: true, granted: true, revoked: true })
})

test('sidebar hides unavailable groups and keeps only permitted destinations after revocation', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick } = await import('/node_modules/.vite/deps/vue.js')
    const { createI18n } = await import('/node_modules/.vite/deps/vue-i18n.js')
    const { default: Sidebar } = await import('/src/shared/LayoutComponents/OrganizationSidebar.vue')
    const { default: router } = await import('/src/router/index.ts')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const { canOrganizationRoute } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    await router.push({name: 'Access Denied Organization'})
    const store = useUserStore()
    store.setPermissions([P.PROJECT_FETCH])
    const host = document.createElement('div'); document.body.appendChild(host)
    const app = createApp({render: () => h(Sidebar, {open: true})})
    app.use(router); app.use(createI18n({legacy: false, locale: 'en', messages: {en: {}}, missingWarn: false, fallbackWarn: false}))
    app.mount(host); await nextTick()
    host.querySelector<HTMLButtonElement>('.side-rail-btn')?.click(); await nextTick()
    const hrefs = [...host.querySelectorAll('a[href]')].map(el => el.getAttribute('href')!)
    const invalid = hrefs.filter(href => href.startsWith('/organization') && !canOrganizationRoute(router.resolve(href)))
    const hasProjects = hrefs.some(href => href === '/organization/projects')
    store.setPermissions([]); await nextTick()
    const projectsAfterRevoke = [...host.querySelectorAll('a[href]')].some(el => el.getAttribute('href') === '/organization/projects')
    app.unmount(); host.remove()
    return { invalid, hasProjects, projectsAfterRevoke }
  })
  expect(result).toEqual({ invalid: [], hasProjects: true, projectsAfterRevoke: false })
})

test('action callbacks recheck revoked permissions and independent routes do not inherit list access', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: router } = await import('/src/router/index.ts')
    const { canPermissionAction } = await import('/src/features/permission/Presentation/Helpers/organization_actions.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    store.setPermissions([P.PROJECT_DELETE])
    const action = {permission: [P.PROJECT_DELETE]}
    const before = canPermissionAction(action, router)
    store.setPermissions([P.PROJECT_FETCH])
    return { before, after: canPermissionAction(action, router), create: canPermissionAction({link: '/organization/projects/add'}, router), unknownCallback: canPermissionAction({}, router) }
  })
  expect(result).toEqual({ before: true, after: false, create: false, unknownCallback: false })
})

test('HTTP 403 invalidates cached grants and blocks subsequent requests before dispatch', async ({ page }) => {
  await setup(page)
  let calls = 0
  await page.route('**/organization/fetch_projects', route => { calls++; return route.fulfill({status: 403, json: {message: 'Denied fixture'}}) })
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: Service } = await import('/src/base/Data/ApiService/api_service_interface.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore(); store.setPermissions([P.PROJECT_FETCH])
    class TestService extends Service { applyService() { return this.call({url: 'https://api.hse.techlabeg.com/organization/fetch_projects', type: 'post', auth: true})} }
    try { await new TestService().applyService() } catch { /* expected denial */ }
    try { await new TestService().applyService() } catch { /* expected local denial */ }
    return {invalidated: store.permissionsInvalidated, grants: store.user.permission.length}
  })
  expect(calls).toBe(1)
  expect(result).toEqual({invalidated: true, grants: 0})
})

test('scoped refresh updates current grants and cannot transfer grants to another session', async ({ page }) => {
  await setup(page)
  let responses = 0
  await page.route('**/show_permissions', async route => {
    responses++
    if (responses === 2) await page.evaluate(async () => {
      const { useUserStore } = await import('/src/stores/user.ts')
      const store = useUserStore()
      store.setUser({...store.user, id: 900002, apiToken: 'different-test-session', permission: [], permissionsLoaded: true})
    })
    await route.fulfill({json: {status: true, data: {type_id: 900001, type: 2, permissions: ['PJ01']}}})
  })
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { refreshOrganizationPermissions } = await import('/src/features/permission/Presentation/Helpers/refresh_organization_permissions.ts')
    const { can } = await import('/src/features/permission/Presentation/Helpers/organization_permission.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    const refreshed = await refreshOrganizationPermissions()
    const granted = can(P.PROJECT_FETCH)
    const staleRefresh = await refreshOrganizationPermissions()
    return {refreshed, granted, staleRefresh, newUserUnaffected: store.user.id === 900002 && store.user.permission.length === 0, loading: store.permissionsLoading}
  })
  expect(responses).toBe(2)
  expect(result).toEqual({refreshed: true, granted: true, staleRefresh: false, newUserUnaffected: true, loading: false})
})

test('revoking access redirects an already-open protected page', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { createRouter, createMemoryHistory } = await import('/node_modules/.vite/deps/vue-router.js')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { watchOrganizationAuthorization } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const router = createRouter({history: createMemoryHistory(), routes: [
      {path: '/organization/projects', name: 'Projects', component: {render: () => null}},
      {path: '/organization/access-denied', name: 'Access Denied Organization', component: {render: () => null}},
    ]})
    const store = useUserStore(); store.setPermissions([P.PROJECT_FETCH])
    await router.push('/organization/projects')
    const stop = watchOrganizationAuthorization(router)
    const redirected = new Promise(resolve => {const remove = router.afterEach(to => {if (to.name === 'Access Denied Organization') {remove(); resolve(true)}})})
    store.setPermissions([])
    await redirected
    stop()
    return {name: String(router.currentRoute.value.name), from: router.currentRoute.value.query.from}
  })
  expect(result).toEqual({name: 'Access Denied Organization', from: '/organization/projects'})
})

test('investigation result creation and read-only answers require independent grants', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: router } = await import('/src/router/index.ts')
    const { canOrganizationRoute } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    const createRoute = router.resolve('/organization/Investigating-result/7')
    const readRoute = router.resolve('/organization/Investigating-result-answer/7')
    store.setPermissions([P.FULL_INVESTIGATION_MEETING_RESULT_CREATE])
    const createAllowed = canOrganizationRoute(createRoute)
    const readDenied = !canOrganizationRoute(readRoute)
    store.setPermissions([P.INVESTIGATION_DETAILS])
    return {createAllowed, readDenied, readAllowed: canOrganizationRoute(readRoute), createDenied: !canOrganizationRoute(createRoute)}
  })
  expect(result).toEqual({createAllowed: true, readDenied: true, readAllowed: true, createDenied: true})
})

test('attachment matrix read-only users cannot upload or save and stale submit is guarded', async ({ page }) => {
  await setup(page)
  let writes = 0
  await page.route('**/create_attachment_matrix', route => {writes++; return route.abort()})
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick } = await import('/node_modules/.vite/deps/vue.js')
    const { default: Matrix } = await import('/src/features/Organization/AttachmentMatrix/Presentation/components/AttachmentMatrixForm.vue')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    const host = document.createElement('div'); document.body.appendChild(host)
    const app = createApp({render: () => h(Matrix)})
    app.config.globalProperties.$t = (key: string) => key
    app.mount(host); await nextTick()
    const initiallyDenied = !host.querySelector('form')
    store.setPermissions([P.ATTACHMENT_MATRIX_FETCH]); await nextTick()
    const readOnly = !!host.querySelector('form') && !host.querySelector('input[type=file]') && !host.querySelector('button[type=submit]')
    store.setPermissions([P.ATTACHMENT_MATRIX_FETCH, P.ATTACHMENT_MATRIX_CREATE]); await nextTick()
    const button = host.querySelector<HTMLButtonElement>('button[type=submit]')!
    const editable = !!button && !!host.querySelector('input[type=file]')
    store.setPermissions([P.ATTACHMENT_MATRIX_FETCH])
    button.click()
    await nextTick()
    app.unmount(); host.remove()
    return {initiallyDenied, readOnly, editable}
  })
  expect(result).toEqual({initiallyDenied: true, readOnly: true, editable: true})
  expect(writes).toBe(0)
})

test('inspection results and self tasks do not inherit ordinary inspection list grants', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { canOrganizationApi } = await import('/src/features/permission/Presentation/Helpers/organization_authorization.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore()
    store.setPermissions([P.ORG_INSPECTION_FETCH])
    const resultsDenied = !canOrganizationApi('fetch_inspections_results')
    store.setPermissions([P.INSPECTION_RESULTS_FETCH])
    const resultsAllowed = canOrganizationApi('fetch_inspections_results')
    store.setPermissions([P.MY_TASKS_ALL])
    return {resultsDenied, resultsAllowed, ownTasks: canOrganizationApi('fetch_my_tasks'), allTasksDenied: !canOrganizationApi('fetch_tasks')}
  })
  expect(result).toEqual({resultsDenied: true, resultsAllowed: true, ownTasks: true, allTasksDenied: true})
})

test('investigation list retains report text without granting a details link', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick } = await import('/node_modules/.vite/deps/vue.js')
    const { default: Table } = await import('/src/features/Organization/Investigating/Presentation/components/Investigating/InvestigatingTable.vue')
    const { default: router } = await import('/src/router/index.ts')
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore(); store.setPermissions([P.INVESTIGATION_FETCH])
    const host = document.createElement('div'); document.body.appendChild(host)
    const app = createApp({render: () => h(Table, {items: [{Investegationid: 77, status: 1, observation: {id: 7, type: 1, serialName: 'OBS-7', title: 'Fixture report'}}]})})
    app.use(router); app.config.globalProperties.$t = (key: string) => key
    app.mount(host); await nextTick()
    const readable = host.textContent?.includes('OBS-7') === true
    const initiallyUnlinked = !host.querySelector('a.report-reference')
    store.setPermissions([P.INVESTIGATION_FETCH, P.ORG_OBSERVATION_DETAILS]); await nextTick()
    const linkedWhenAllowed = !!host.querySelector('a.report-reference')
    app.unmount(); host.remove()
    return {readable, initiallyUnlinked, linkedWhenAllowed}
  })
  expect(result).toEqual({readable: true, initiallyUnlinked: true, linkedWhenAllowed: true})
})

test('authenticated service calls cannot bypass denial by losing the Organization session', async ({ page }) => {
  await setup(page)
  let requests = 0
  await page.route('**/dashboard/create_project', route => {requests++; return route.abort()})
  const denied = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: Service } = await import('/src/base/Data/ApiService/api_service_interface.ts')
    await useUserStore().logout()
    class TestService extends Service {applyService() {return this.call({url: 'https://api.hse.techlabeg.com/dashboard/create_project', type: 'post', auth: true})}}
    try {await new TestService().applyService(); return false} catch {return true}
  })
  expect(denied).toBe(true)
  expect(requests).toBe(0)
})

test('session token or account-type changes clear project context even when account IDs match', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { useProjectSelectStore } = await import('/src/stores/ProjectSelect.ts')
    const store = useUserStore(), projects = useProjectSelectStore()
    const account = {...store.user}
    projects.setAllProjects([{id: 11, title: 'Previous session project'}])
    projects.setProjectId({id: 11, title: 'Previous session project'})
    store.setUser({...account, apiToken: 'replacement-local-session', permission: []})
    const tokenCleared = projects.AllProjects.length === 0 && !projects.getProjectId()
    projects.setAllProjects([{id: 12, title: 'Previous account type project'}])
    projects.setProjectId({id: 12, title: 'Previous account type project'})
    store.setUser({...store.user, type: 1, permission: []})
    return {tokenCleared, typeCleared: projects.AllProjects.length === 0 && !projects.getProjectId()}
  })
  expect(result).toEqual({tokenCleared: true, typeCleared: true})
})

test('export and print action metadata cannot borrow CRUD grants', async ({ page }) => {
  await setup(page)
  const result = await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { default: router } = await import('/src/router/index.ts')
    const { canPermissionAction, canOrganizationCapability } = await import('/src/features/permission/Presentation/Helpers/organization_actions.ts')
    const { PermissionsEnum: P } = await import('/src/features/users/Admin/Core/Enum/permission_enum.ts')
    const store = useUserStore(); store.setPermissions([P.PROJECT_FETCH, P.PROJECT_DELETE])
    const exportDenied = !canPermissionAction({permission: [P.PROJECT_FETCH], capability: 'export'}, router)
    const printDenied = !canPermissionAction({permission: [P.PROJECT_DELETE], capability: 'print'}, router)
    const downloadDenied = !canOrganizationCapability('download')
    store.$patch({user: {...store.user, isMaster: 1}})
    return {exportDenied, printDenied, downloadDenied, existingMasterRule: canOrganizationCapability('export')}
  })
  expect(result).toEqual({exportDenied: true, printDenied: true, downloadDenied: true, existingMasterRule: true})
})

test('composed report export is hidden and its exposed Excel method cannot save files', async ({ page }) => {
  await setup(page)
  let downloads = 0
  page.on('download', () => downloads++)
  const result = await page.evaluate(async () => {
    const { createApp, h, nextTick, ref } = await import('/node_modules/.vite/deps/vue.js')
    const { default: Exporter } = await import('/src/features/Organization/TaskReports/Presentation/subComponents/ExportReportPdf.vue')
    const { default: router } = await import('/src/router/index.ts')
    const component = ref()
    const host = document.createElement('div'); document.body.appendChild(host)
    const app = createApp({render: () => h(Exporter, {ref: component, data: [{id: 1, title: 'Private fixture'}]})})
    app.use(router); app.config.globalProperties.$t = (key: string) => key
    app.mount(host); await nextTick()
    const hidden = !host.querySelector('button')
    const callable = typeof component.value.exportExcel === 'function'
    component.value.exportExcel()
    await nextTick()
    app.unmount(); host.remove()
    return {hidden, callable}
  })
  expect(result).toEqual({hidden: true, callable: true})
  expect(downloads).toBe(0)
})
