// Browser fixtures only. No fixture data is imported by the production dashboard.
import { installFixtures } from '../../src/features/Organization/Project/tests/project-fixtures.mjs'
export const dashboardEndpoints = {
  summary: 'fetch_home_inspection_and_observations_statices',
  equipment: 'fetch_home_equipments_statices',
  safety: 'fetch_home_observation_types_with_zones_statices',
  projects: 'fetch_projects',
}
export async function installDashboardFixtures(
  page,
  { locale = 'en', mode = 'populated', restricted = false, size = 3, rootCauses = true } = {},
) {
  await installFixtures(page, { locale, permitted: !restricted })
  await page.routeWebSocket('**', (socket) => socket.close())
  await page.addInitScript(
    ({ restricted }) => {
      localStorage.removeItem('hse:project-lists:v1')
      if (restricted) {
        const state = JSON.parse(localStorage.getItem('user'))
        state.user.employeeType = 2
        state.user.permission = ['OIS01']
        localStorage.setItem('user', JSON.stringify(state))
      }
    },
    { restricted },
  )
  const controls = { mode, failures: new Set(), delay: null, requests: [] }
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()
    const body = route.request().postDataJSON() || {}
    const key = Object.keys(dashboardEndpoints).find((key) => dashboardEndpoints[key] === endpoint)
    if (!key || (key === 'projects' && body.limit !== 5)) return route.fallback()
    controls.requests.push({ key, body })
    if (controls.delay) await controls.delay(key, body)
    if ((controls.mode === 'error' && key === 'summary') || controls.failures.has(key))
      return route.fulfill({
        status: 503,
        json: { status: false, message: 'Fixture service unavailable' },
      })
    let data
    if (controls.mode === 'empty')
      data =
        key === 'projects'
          ? { data: [], meta: { total: 0, current_page: 1, last_page: 1 } }
          : key === 'safety'
            ? []
            : null
    else if (key === 'summary')
      data = {
        total_incidents: body.project_id ? Number(body.project_id) : 27,
        total_inspection: 70,
        inspection_compliance_percentage: 99,
        open_corrective_actions: 9,
        hazard_observations_high: 7,
        total_inspection_supposed_occured_this_month: 54,
        total_finished_inspections_results: 33,
        inspection_status: { new: 12, in_progress: 21, completed: 33, canceled: 2, delayed: 4 },
        employee_certificates_status: { total: 160, active: 124, inactive: 20, expired: 16 },
        most_used_root_causes: rootCauses
          ? [{ root_cause_id: 1, root_cause_title: 'Work planning', count: 4 }]
          : [],
        hazard_with_high_risk_observations: [],
      }
    else if (key === 'equipment')
      data = {
        rent_and_owned_equipments: { owned: 82, rent: 18 },
        equipment_types_and_equipments_and_zones: Array.from({ length: size }, (_, i) => ({
          id: i + 1,
          title: `Equipment location ${i + 1}`,
          total_equipments: 30 + i,
          equipment_types: [
            { type: 1, count: 12 + i },
            { type: 2, count: 8 },
            { type: 3, count: 10 },
          ],
        })),
      }
    else if (key === 'safety')
      data = Array.from({ length: size }, (_, i) => ({
        zone_id: i + 1,
        zone_title: `Open location ${i + 1}`,
        all_observations: { hazard: 4 + i, accidents: 2 + i, observation: 14 + i },
      }))
    else {
      const all = Array.from({ length: 14 }, (_, i) => ({
        id: i + 1,
        title: `Project ${i + 1}`,
        titles: [
          { locale: 'en', title: `Project ${i + 1}` },
          { locale: 'ar', title: `المشروع ${i + 1}` },
        ],
        serial_name: `PRJ-${i + 1}`,
        status: 1,
        project_progress: i === 0 ? 40 : 70,
        observation_accidents_count: i + 1,
        inspections_count: 8 + i,
        assigned_employees_count: 12,
        equipment_count: 21,
      }))
      const filtered = body.project_id ? all.filter((row) => row.id === body.project_id) : all
      const current = body.project_id ? 1 : body.page || 1
      data = {
        data: filtered.slice((current - 1) * 5, current * 5),
        meta: {
          total: filtered.length,
          current_page: current,
          last_page: Math.max(1, Math.ceil(filtered.length / 5)),
          per_page: 5,
        },
      }
    }
    if (controls.mode === 'partial' && key === 'summary')
      data = { total_incidents: 0, inspection_status: { completed: 3 } }
    await route.fulfill({ status: 200, json: { status: true, message: 'OK', data } })
  })
  return controls
}
