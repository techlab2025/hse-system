/* Browser-only fixtures. All remote requests are intercepted, including writes.
 * These values never enter production components or replace API integration. */
export const project = {
  id: 433,
  title: 'New Capital Project',
  description: 'Main construction and commissioning project.',
  titles: [
    { locale: 'en', title: 'New Capital Project' },
    { locale: 'ar', title: 'مشروع العاصمة الجديدة' },
  ],
  descriptions: [{ locale: 'en', description: 'Project scope' }],
  serial_name: 'PRJ-433',
  serial_number: '433',
  start_date: '2026-01-01',
  end_date: '2026-12-31',
  project_status: 3,
  project_progress: 60,
  status: 1,
  partner: { id: 1, title: 'Construction partner' },
  locations: [],
  zoons: [],
  contractors: [],
  methods: [],
  observations_count: 32,
  observation_hazards_count: 4,
  observation_accidents_count: 2,
  incidents_count: 2,
  investigation_count: 3,
  investigations_count: 3,
  inspections_count: 18,
  assigned_employees_count: 46,
  equipment_count: 21,
  assigned_locations_count: 3,
  assigned_zones_count: 9,
  teams_count: 5,
  positions_count: 12,
  contractors_count: 2,
  drills_count: 6,
  actual_drills_count: 3,
  meetings_count: 14,
  meetings_with_results_count: 10,
  loss_times: [],
  project_locations: [],
  project_zoons: [],
  hierarchies: [],
  organization_employees: [],
  team_locations: [],
  meetings: [],
  drills: [],
}
const projects = [
  project,
  { ...project, id: 434, title: 'West Site Project', status: 3, project_progress: 20 },
  {
    ...project,
    id: 435,
    title: 'Equipment Renewal',
    status: 2,
    project_status: 5,
    project_progress: 100,
  },
]
const assessment = {
  id: 7,
  activity: 'Work at height',
  activity_description: 'Inspect work controls',
  work_area: 'North site',
  date: '2026-10-01',
  creatable: { id: 1, name: 'Test approver', titles: [], languages: [] },
  media: [],
}
export async function installFixtures(
  page,
  { locale = 'en', permitted = true, listState = 'success' } = {},
) {
  const requests = []
  await page.addInitScript(
    ({ locale, permitted }) => {
      localStorage.setItem('lang', locale)
      localStorage.setItem(
        'user',
        JSON.stringify({
          isAuth: true,
          expiresAt: Date.now() + 86400000,
          user: {
            id: 1,
            name: 'Visual test',
            isMaster: permitted ? 1 : 0,
            type: 2,
            employeeType: 1,
            permission: [],
            languages: [],
            apiToken: 'local-browser-fixture',
          },
        }),
      )
    },
    { locale, permitted },
  )
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()
    let body = {}
    try {
      body = route.request().postDataJSON() || {}
    } catch {
      /* multipart requests are recorded separately */
    }
    requests.push({ endpoint, body, raw: route.request().postData() })
    let data = []
    if (endpoint === 'fetch_projects') {
      const rows =
        listState === 'empty'
          ? []
          : projects.filter(
              (p) => !body.word || p.title.toLowerCase().includes(body.word.toLowerCase()),
            )
      data = {
        data: rows,
        meta: {
          from: 1,
          to: rows.length,
          current_page: body.page || 1,
          last_page: 2,
          per_page: body.limit || 10,
          total: 12,
        },
      }
      if (listState === 'failed')
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Test service unavailable' }),
        })
    }
    if (endpoint === 'fetch_project_summary_details' || endpoint === 'fetch_project_details')
      data = project
    if (endpoint === 'fetch_risk_assessments') data = [assessment]
    if (endpoint === 'fetch_risk_assessment_details') data = assessment
    if (endpoint === 'fetch_languages')
      data = [
        { id: 1, code: 'en', title: 'English' },
        { id: 2, code: 'ar', title: 'Arabic' },
      ]
    if (endpoint === 'fetch_locations' || endpoint === 'fetch_contractors')
      data = [
        {
          id: 1,
          title: 'North site',
          name: 'Test contractor',
          titles: [{ locale: 'en', title: 'North site' }],
        },
      ]
    if (endpoint?.startsWith('create_') || endpoint?.startsWith('update_'))
      data = { ...project, project_status: 1, project_progress: 20 }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data, message: 'OK', status: true }),
    })
  })
  return requests
}
